import { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import useClientIdentifier from '@/hooks/useClientIdentifier.tsx';
import { useToast } from '@/hooks/useToast';
import { createAuthPin } from '@/services/PlexService.tsx';

const Login = () => {
  const clientIdentifier = useClientIdentifier();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!clientIdentifier) {
      toast({
        title: 'Login unavailable',
        description: 'Initializing browser session. Please try again in a second.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoggingIn(true);

    try {
    const { origin, pathname } = window.location;

    const authPin = await createAuthPin(clientIdentifier);
    const currentPath = encodeURIComponent(pathname);

    const redirectParams = `code=${authPin.code}&id=${authPin.id}&redirect=${currentPath}`;
    const forwardUrl = encodeURIComponent(
      `${origin}/auth-redirect?${redirectParams}`,
    );

    const loginParams = `code=${authPin.code}&forwardUrl=${forwardUrl}&clientID=${clientIdentifier}`;
    window.location.href = `https://app.plex.tv/auth#?${loginParams}`;
    } catch (error) {
      console.error('Error starting Plex login:', error);
      toast({
        title: 'Login failed',
        description:
          'Could not start Plex login. Check that the backend is reachable, then try again.',
        variant: 'destructive',
      });
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="border rounded-lg p-6">
      <h1 className="text-xl font-bold text-center ">
        Plexio: Plex Interaction for Stremio
      </h1>
      <p className="text-sm text-center mt-2">
        Seamlessly connects your Plex and Stremio accounts, letting you enjoy
        your Plex media directly within Stremio.
      </p>
      <div className="mt-6">
        <Button
          onClick={handleLogin}
          className="w-full"
          disabled={isLoggingIn || !clientIdentifier}
        >
          {isLoggingIn ? 'Opening Plex login...' : 'Login'}
        </Button>
      </div>
    </div>
  );
};

export default Login;
