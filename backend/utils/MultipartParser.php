<?php
class MultipartParser {
    public static function parse(string $body, string $content_type): array {
        $result = [];

        if(!preg_match('/boundary=(.+)/', $content_type, $matches)){
            return $result;
        }

        $boundary = trim($matches[1]);
        $parts = explode('--' . $boundary, $body);

        foreach($parts as $part){
            $part = trim($part);
            if($part === '' || $part === '--'){
                continue;
            }
            if(strpos($part, "\r\n\r\n") === false ){
                continue;
            }

            [$headers, $value] = explode("\r\n\r\n", $part, 2);

            if (!preg_match('/Content-Disposition:\s*form-data;\s*name="([^"]+)"/', $headers, $name_match)){
                continue;
            }

            $field_name = $name_match[1];

            if (preg_match('/filename="[^"]+"/', $headers)) {
                continue;
            }

            $result[$field_name] = rtrim($value, "\r\n");
        }
        return $result;
    }
}