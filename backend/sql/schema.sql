CREATE TABLE IF NOT EXISTS user (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS card (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name_ig VARCHAR(255) NOT NULL,
    name_pt VARCHAR(255) NOT NULL,
    card_set CHAR(36) NOT NULL, 
    card_game ENUM('magic', 'yugioh', 'pokemon') NOT NULL,
    img_url VARCHAR(500),
    rarity ENUM('common', 'uncommon', 'rare', 'mythic', 'legendary') NOT NULL
);

CREATE TABLE IF NOT EXISTS collection (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    id_user CHAR(36) NOT NULL,
    FOREIGN KEY (id_user) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS card_collection (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    id_card CHAR(36) NOT NULL,
    id_collection CHAR(36) NOT NULL,
    FOREIGN KEY (id_card) REFERENCES card(id),
    FOREIGN KEY (id_collection) REFERENCES collection(id)
);