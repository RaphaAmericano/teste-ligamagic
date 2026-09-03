<?php
class JWT {
    private string $secret;

    public function __construct(string $secret){
        $this->secret = $secret;
    }

    public function generate(array $payload, int $exp = 3600): string {
        $header = $this->base64url(json_encode([
            'alg' => 'HS256',
            'typ' => 'JWT'
        ]));

        $payload['iat'] = time();
        $payload['exp'] = time() + $exp;
        $payloadEncoded = $this->base64url(json_encode($payload));

        $signature = $this->base64url(
            hash_hmac('sha256', "$header.$payloadEncoded", $this->secret, true)
        )

        return "$header.$payloadEncoded.$signature";
    }

    public function verify(string $token): array | false {
        $parts = explode('.', $token);
        if(count($parts) !== 3){
            return false;
        }

        [$header, $payload, $signature] = $parts;

        $expectedSignature = $this->base64url(
            hash_hmac('sha256', "$header.$payload", $this->secret, true)
        );

        if(!hash_equals($expectedSignature, $signature)){
            return false;
        }

        $data = json_decode($this->base64urlDecode($payload), true );

        if(!isset($data['exp']) || $data['exp'] < time()){
            return false;
        }

        return $data;

    }

    public function extractFromHeader(): ?string {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (preg_match('/Bearer\s+(.+)$/i', $header, $matches)) {
            return $matches[1];
        }
        return null;
    }

    private function base64url(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function base64urlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/'));
    }

}