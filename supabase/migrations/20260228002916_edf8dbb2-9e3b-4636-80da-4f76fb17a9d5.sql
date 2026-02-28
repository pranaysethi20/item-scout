
-- Conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(listing_id, buyer_id)
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations" ON public.conversations
FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Authenticated users can create conversations" ON public.conversations
FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Use a security definer function to check conversation membership
CREATE OR REPLACE FUNCTION public.is_conversation_member(_user_id UUID, _conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversations
    WHERE id = _conversation_id
    AND (buyer_id = _user_id OR seller_id = _user_id)
  )
$$;

CREATE POLICY "Users can view messages in their conversations" ON public.messages
FOR SELECT USING (public.is_conversation_member(auth.uid(), conversation_id));

CREATE POLICY "Users can send messages in their conversations" ON public.messages
FOR INSERT WITH CHECK (auth.uid() = sender_id AND public.is_conversation_member(auth.uid(), conversation_id));

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
