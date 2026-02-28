
-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'trade_match',
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  data JSONB DEFAULT '{}',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Function to detect mutual trade matches
-- When User A swipes right on User B's listing,
-- check if User B has swiped right on any of User A's listings.
-- If so, mark both as matched and notify both users.
CREATE OR REPLACE FUNCTION public.check_trade_match()
RETURNS TRIGGER AS $$
DECLARE
  swiper_id UUID;
  listing_owner_id UUID;
  swiped_listing_title TEXT;
  reverse_match RECORD;
  swiper_name TEXT;
  owner_name TEXT;
  owner_listing_title TEXT;
BEGIN
  -- Only check on right swipes
  IF NEW.direction != 'right' THEN
    RETURN NEW;
  END IF;

  swiper_id := NEW.user_id;

  -- Get the listing owner and title
  SELECT user_id, title INTO listing_owner_id, swiped_listing_title
  FROM public.listings WHERE id = NEW.listing_id;

  -- Don't match with yourself
  IF swiper_id = listing_owner_id THEN
    RETURN NEW;
  END IF;

  -- Check if the listing owner has swiped right on any of the swiper's listings
  SELECT tm.id, tm.listing_id INTO reverse_match
  FROM public.trade_matches tm
  JOIN public.listings l ON l.id = tm.listing_id
  WHERE tm.user_id = listing_owner_id
    AND l.user_id = swiper_id
    AND tm.direction = 'right'
    AND tm.matched = false
  LIMIT 1;

  IF reverse_match.id IS NOT NULL THEN
    -- It's a match! Update both trade_matches
    UPDATE public.trade_matches SET matched = true WHERE id = NEW.id;
    UPDATE public.trade_matches SET matched = true WHERE id = reverse_match.id;
    NEW.matched := true;

    -- Get display names
    SELECT display_name INTO swiper_name FROM public.profiles WHERE user_id = swiper_id;
    SELECT display_name INTO owner_name FROM public.profiles WHERE user_id = listing_owner_id;
    SELECT title INTO owner_listing_title FROM public.listings WHERE id = reverse_match.listing_id;

    -- Notify the swiper
    INSERT INTO public.notifications (user_id, type, title, body, data)
    VALUES (
      swiper_id,
      'trade_match',
      '🎉 Trade Match!',
      owner_name || ' wants to trade their "' || owner_listing_title || '" for your item!',
      jsonb_build_object(
        'matched_user_id', listing_owner_id,
        'your_listing_id', reverse_match.listing_id,
        'their_listing_id', NEW.listing_id
      )
    );

    -- Notify the listing owner
    INSERT INTO public.notifications (user_id, type, title, body, data)
    VALUES (
      listing_owner_id,
      'trade_match',
      '🎉 Trade Match!',
      swiper_name || ' wants to trade their item for your "' || swiped_listing_title || '"!',
      jsonb_build_object(
        'matched_user_id', swiper_id,
        'your_listing_id', NEW.listing_id,
        'their_listing_id', reverse_match.listing_id
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_trade_swipe
BEFORE INSERT ON public.trade_matches
FOR EACH ROW EXECUTE FUNCTION public.check_trade_match();
