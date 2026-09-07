CREATE TABLE IF NOT EXISTS user (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS card (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name_en VARCHAR(255) NOT NULL,
    name_pt VARCHAR(255) NOT NULL,
    card_set CHAR(36) NOT NULL, 
    card_game ENUM('magic', 'yugioh', 'pokemon') NOT NULL,
    img_url VARCHAR(500),
    rarity ENUM(
    'common', 'uncommon', 'rare', 'mythic_rare',
    'reverse_holo', 'rare_holo', 'ultra_rare', 'illustration_rare',
    'special_illustration_rare', 'hyper_rare', 'promotional',
    'super_rare', 'secret_rare', 'ultimate_rare', 'collectors_rare',
    'ghost_rare', 'starlight_rare', 'quarter_century_secret_rare'
) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_card (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    id_card CHAR(36) NOT NULL,
    id_user CHAR(36) NOT NULL,
    FOREIGN KEY (id_card) REFERENCES card(id),
    FOREIGN KEY (id_user) REFERENCES user(id)
);