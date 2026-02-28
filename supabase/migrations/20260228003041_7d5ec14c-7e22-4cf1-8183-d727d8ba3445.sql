
CREATE POLICY "Users can update their own conversations" ON public.conversations
FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
