<?php
require_once __DIR__ . '/../Auth.php';
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
        $rarity = $_POST['rarity'] ?? null;

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
        $stmt = $db->prepare('INSERT INTO card (id, name_pt, name_en, card_game, card_set, rarity, img_url) VALUES (?, ?, ?, ?, ?, ?, ?)');
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
        $payload = $this->auth->verifyToken();
        if(!$payload){
            http_response_code(401);
            echo json_encode(['error' => 'Token inválido ou ausente.'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $user_id = $payload['sub'];
        $db = Database::getInstance()->getConnection();

        $stmt = $db->prepare('
            SELECT c.id, c.name_en, c.name_pt, c.card_set, c.card_game, c.rarity, c.img_url
            FROM card c
            INNER JOIN user_card uc ON uc.id_card = c.id
            WHERE uc.id_user = ?
        ');
        $stmt->bind_param('s', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $cards = [];
        while($row = $result->fetch_assoc()){
            if($row['img_url'] && str_starts_with($row['img_url'], '/')){
                $row['img_url'] = 'http://localhost:8080' . $row['img_url'];
            }
            $cards[] = $row;
        }
        $response = ["items" => $cards, "count" => count($cards)];
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        $stmt->close();
    }

    public function getById(): void {
        $payload = $this->auth->verifyToken();
        if(!$payload){
            http_response_code(401);
            echo json_encode(['error' => 'Token inválido']);
            return;
        }

        $card_id = $_GET['card_id'] ?? '';
        $user_id = $payload['sub'];

        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare('
            SELECT c.id, c.name_pt, c.name_en, c.card_game, c.card_set, c.rarity, c.img_url
            FROM card c
            INNER JOIN user_card uc ON uc.id_card = c.id
            WHERE c.id = ? AND uc.id_user = ?
        ');

        $stmt->bind_param('ss', $card_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $card = $result->fetch_assoc();
        $stmt->close();

        if($card && $card['img_url'] && str_starts_with($card['img_url'], '/')){
            $card['img_url'] = 'http://localhost:8080' . $card['img_url'];
        }

        if(!$card){
            http_response_code(404);
            echo json_encode(['error' => 'Carta não encontrada']);
            return;
        }

        echo json_encode($card, JSON_UNESCAPED_UNICODE);
    }

    public function editCard(): void {
        $payload = $this->auth->verifyToken();
        if(!$payload){
            http_response_code(401);
            echo json_encode(['error' => 'Token inválido ou ausent'], JSON_UNESCAPED_UNICODE);
            return;
        }
        
        parse_str(file_get_contents('php://input'), $post_data);

        $card_id = $_GET['card_id'] ?? '';
        $user_id = $payload['sub'];

        $db = Database::getInstance()->getConnection();

        $check = $db->prepare('SELECT c.id, c.img_url FROM card c INNER JOIN user_card uc ON uc.id_card = c.id WHERE c.id = ? AND uc.id_user = ?');
        $check->bind_param('ss', $card_id, $user_id);
        $check->execute();
        $existing = $check->get_result()->fetch_assoc();
        $check->close();
        if(!$existing){
            http_response_code(404);
            echo json_encode(['error' => 'Carta não encontrada'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $fields = [];
        $types = '';
        $values = [];

        $name_pt = $post_data['name_pt'] ?? null;
        $name_en = $post_data['name_en'] ?? null;
        $card_game = $post_data['card_game'] ?? null;
        $card_set = $post_data['card_set'] ?? null;
        $rarity = $post_data['rarity'] ?? null;

        if($name_pt !== null ){
            if(strlen($name_pt) > self::MAX_NAME_LENGTH){
                http_response_code(400);
                echo json_encode(['error' => 'name_pt deve ter no máximo 255 caracteres'], JSON_UNESCAPED_UNICODE);
                return;
            }
            $fields[] = 'name_pt = ?';
            $types .= 's';
            $values[] = $name_pt;
        }
        if($name_en !== null){
            if(strlen($name_en) > self::MAX_NAME_LENGTH){
                http_response_code(400);
                echo json_encode(['error' => 'name_en deve ter no máximo 255 caracteres'], JSON_UNESCAPED_UNICODE);
                return;
            }
            $fields[] = 'name_en = ?';
            $types .= 's';
            $values[] = $name_en;
        }

        if($card_game !== null ){
            if(!in_array($card_game, self::CARD_GAMES, true)){
                http_response_code(400);
                echo json_encode(['error' => 'Card game inválido'], JSON_UNESCAPED_UNICODE);
                return;
            }
            $fields[] = 'card_game = ?';
            $types .= 's';
            $values[] = $card_game;
        }

        if($card_set !== null ){
            $fields[] = 'card_set = ?';
            $types .= 's';
            $values[] = $card_set;
        }

        if($rarity !== null ){
            $fields[] = 'rarity = ?';
            $types .= 's';
            $values[] = $rarity;
        }
        
        if (empty($fields)) {
            http_response_code(400);
            echo json_encode(['error' => 'Nenhum dado para atualizar'], JSON_UNESCAPED_UNICODE);
            return;
        }
        $types .= 's';
        $values[] = $card_id;
        $sql = 'UPDATE card SET ' . implode(', ', $fields) . ' WHERE id = ?';
        $stmt = $db->prepare($sql);
        $stmt->bind_param($types, ...$values);

        if($stmt->execute()){
            echo json_encode(['message' => 'Carta atualizada com sucesso'], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao atualizar carta'], JSON_UNESCAPED_UNICODE);
        }
        $stmt->close();

    }

    public function uploadImage(): void {
        $payload = $this->auth->verifyToken();
        if(!$payload){
            http_response_code(401);
            echo json_encode(['error' => 'Token inválido ou ausente'], JSON_UNESCAPED_UNICODE);
            return;
        }
        $card_id = $_GET['card_id'] ?? '';
        $user_id = $payload['sub'];

        $db = Database::getInstance()->getConnection();
        $check = $db->prepare('SELECT c.id FROM card c INNER JOIN user_card uc ON uc.id_card = c.id WHERE c.id = ? AND uc.id_user = ?');
        $check->bind_param('ss', $card_id, $user_id);
        $check->execute();
        if(!$check->get_result()->fetch_assoc()){
            $check->close();
            http_response_code(404);
            echo json_encode(['error' => 'Carta não encontrada'], JSON_UNESCAPED_UNICODE);
            return;
        }
        $check->close();

        if(!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK || $_FILES['image']['size'] === 0){
            http_response_code(400);
            echo json_encode(['error' => 'Imagem é obrigatória'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime_type = finfo_file($finfo, $_FILES['image']['tmp_name']);
        finfo_close($finfo);

        if(!in_array($mime_type, self::ALLOWED_IMAGE_TYPES, true)){
            http_response_code(400);
            echo json_encode(['error' => 'Imagem deve ser JPEG, PNG, WebP ou GIF'], JSON_UNESCAPED_UNICODE);
            return;
        }

        if($_FILES['image']['size'] > self::MAX_FILE_SIZE){
            http_response_code(400);
            echo json_encode(['error' => 'Imagem deve ter no máximo 5MB'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $ext_map = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
        ];
        $ext = $ext_map[$mime_type] ?? pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '.' . $ext;
        $dest = __DIR__ . '/../uploads/' . $filename;

        if(!move_uploaded_file($_FILES['image']['tmp_name'], $dest)){
            http_response_code(500);
            echo json_encode(['error' => 'Falha ao salvar imagem'], JSON_UNESCAPED_UNICODE);
            return;
        }

        $img_url = '/uploads/' . $filename;
        $stmt = $db->prepare('UPDATE card SET img_url = ? WHERE id = ?');
        $stmt->bind_param('ss', $img_url, $card_id);

        if($stmt->execute()){
            echo json_encode(['message' => 'Imagem atualizada com sucesso', 'img_url' => 'http://localhost:8080' . $img_url], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Erro ao atualizar imagem'], JSON_UNESCAPED_UNICODE);
        }
        $stmt->close();
    }
}