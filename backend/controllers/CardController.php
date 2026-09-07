<?php
require_once __DIR__ . '/../Auth.php';
require_once __DIR__ . '/../utils/RarityMap.php';
require_once __DIR__ . '/../utils/UUID.php';

class CardController {
    private Auth $auth;

    private const CARD_GAMES = ['magic', 'pokemon', 'yugioh'];
    private const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    private const MAX_FILE_SIZE = 5 * 1024 * 1024;
    private const MAX_NAME_LENGTH = 255;

    public function __construct(Auth $auth){
        $this->auth = $auth;
    }

    public function create(): void {
        $payload = $this->auth->verifyToken();
        if(!$payload){
            http_response_code(401);
            echo json_encode(['error' => 'Token inválido ou ausente.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $name_pt = $_POST['name_pt'] ?? '';
        $name_en = $_POST['name_en'] ?? '';
        $card_game = $_POST['card_game'] ?? '';
        $card_set = $_POST['card_set'] ?? '';
        $rarityCode = $_POST['rarity'] ?? ''; 
        $rarity = RARITY_MAP[$rarityCode] ?? null;

        if(!in_array($card_game, self::CARD_GAMES, true)){
            http_response_code(400);
            echo json_encode(['error' => 'Card game inválido'], JSON_UNESCAPED_UNICODE);
            return;
            }
            
        if(strlen($name_pt) > self::MAX_NAME_LENGTH || strlen($name_en) > self::MAX_NAME_LENGTH){
            http_response_code(400);
            echo json_encode(['error' => 'Nomes devem ter no máximo 255 caracteres'], JSON_UNESCAPED_UNICODE);
            return;
        }

        if(!$rarity){
            http_response_code(400);
            echo json_encode(['error' => 'Raridade inválida'], JSON_UNESCAPED_UNICODE);
            return;
        }

        if(!$name_pt || !$name_en || !$card_game || !$card_set || !$rarity ){
            http_response_code(400);
            echo json_encode(['error' => 'Todos os campos são obrigatórios.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $img_url = null;

        if(!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK || $_FILES['image']['size'] === 0){
            http_response_code(400);
            echo json_encode(['error' => 'Imagem é obrigatória'], JSON_UNESCAPED_UNICODE);
            return;
        }
        
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $_FILES['image']['tmp_name']);
        finfo_close($finfo);

        if(!in_array($mimeType, self::ALLOWED_IMAGE_TYPES, true )){
            http_response_code(400);
            echo json_encode(['error' => 'Imagem deve ser JPEG, PNG, WebP ou GIF'], JSON_UNESCAPED_UNICODE);
            return;
        }

        if($_FILES['image']['size'] > self::MAX_FILE_SIZE){
            http_response_code(400);
            echo json_encode(['error' => 'Imagem deve ter no máximo 5MB'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $file = $_FILES['image']['name'];
        $extMap = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
        ];

        $ext = $extMap[$mimeType] ?? pathinfo($file, PATHINFO_EXTENSION);

        $filename = uniqid() . '.' . $ext;
        $dest = __DIR__ . '/../uploads/' .$filename;
        
        if(!move_uploaded_file($_FILES['image']['tmp_name'], $dest)){
            http_response_code(500);
            echo json_encode(['error' => 'Falha ao salvar image'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $img_url = '/uploads/' . $filename;        

        $card_id = UUID::createUUID();
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare('INSERT INTO card (id, name_pt, name_ig, card_game, card_set, rarity, img_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('sssssss', $card_id, $name_pt, $name_en, $card_game, $card_set, $rarity, $img_url );

        if($stmt->execute()){                       
            $user_id = $payload['sub'];

            $rel = $db->prepare('INSERT INTO user_card (id_card, id_user) VALUES (?, ?)');
            $rel->bind_param('ss', $card_id, $user_id);
            $rel->execute();
            $rel->close();
            echo json_encode(['id' => $card_id, 'message' => 'Carta registrada com sucesso'], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao salva carta'], JSON_UNESCAPED_UNICODE);
        }
        $stmt->close();
    }

    public function userCards(): void {

    }
}