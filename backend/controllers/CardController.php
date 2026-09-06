<?php
require_once __DIR__ . '/../Auth.php';
require_once __DIR__ . '/../utils/RarityMap.php';

class CardController {
    private Auth $auth;

    public function __construct(Auth $auth){
        $this->auth = $auth;
    }

    public function create(): void {
        $payload = $this->auth->verifyToken();
        if(!$payload){
            http_response_code(401);
            echo json_encode(['error' => 'Token inválido ou ausente.']);
            return;
        }
    
        $name_pt = $_POST['name_pt'] ?? '';
        $name_en = $_POST['name_en'] ?? '';
        $card_game = $_POST['card_game'] ?? '';
        $card_set = $_POST['card_set'] ?? '';
        $rarityCode = $_POST['rarity'] ?? ''; 
        $rarity = RARITY_MAP[$rarityCode] ?? null;

        if(!$rarity){
            http_response_code(400);
            echo json_encode(['error' => 'Raridade inválida']);
            return;
        }
        error_log('rarityCode: ' . $rarityCode);
        if(!$name_pt || !$name_en || !$card_game || !$card_set || !$rarity ){
            http_response_code(400);
            echo json_encode(['error' => 'Todos os campos são obrigatórios.']);
            return;
        }
    
        $img_url = null;
        if(isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK){
            $file = $_FILES['image']['name'];
            $ext = pathinfo($file, PATHINFO_EXTENSION);
            $filename = uniqid() . '.' . $ext;
            $dest = __DIR__ . '/../../uploads/' .$filename;
            move_uploaded_file($_FILES['image']['tmp_name'], $dest);
            $img_url = '/uploads/' . $filename;
        }
    
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare('INSERT INTO card (name_pt, name_ig, card_game, card_set, rarity, img_url) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->bind_param('ssssss', $name_pt, $name_en, $card_game, $card_set, $rarity, $img_url );
    
        if($stmt->execute()){
            echo json_encode(['id' => $db->insert_id, 'message' => 'Carta registrada com sucesso']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao salva carta']);
        }
        $stmt->close();
    }
}