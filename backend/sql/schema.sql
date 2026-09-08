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
    'C', 'U', 'R', 'M', 'RH', 'H', 'UR', 'IR', 'SIR', 'HR',
    'PROMO', 'SR', 'ScR', 'UtR', 'CR', 'GR', 'StR', 'QCScR'
    ) NOT NULL
);

CREATE TABLE IF NOT EXISTS user_card (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    id_card CHAR(36) NOT NULL,
    id_user CHAR(36) NOT NULL,
    FOREIGN KEY (id_card) REFERENCES card(id),
    FOREIGN KEY (id_user) REFERENCES user(id)
);