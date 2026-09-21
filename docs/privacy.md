# Privacy Direction

Blipola is designed around data minimization.

## Child mode

The first version should work entirely locally. Do not require a child's email, location, camera, microphone, or external AI account.

## Parent mode

Future parent features may use a separate parent identity and optional cloud synchronization. Parent reporting should expose learning information, not unnecessary child personal data.

## AI

If an external AI service is added later:
- send the minimum learning context required;
- never send secrets from the browser;
- keep the Learning Engine authoritative;
- provide a local/offline fallback;
- document retention and provider policies before production use.
