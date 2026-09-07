<?php
class UUID {
    public function __construct(){}
    static public function createUUID(){
        $hex = bin2hex(random_bytes(16));
        return substr($hex, 0, 8) . '-'
             . substr($hex, 8, 4) . '-'
             . substr($hex, 12, 4) . '-'
             . substr($hex, 16, 4) . '-'
             . substr($hex, 20, 12);
    }
}