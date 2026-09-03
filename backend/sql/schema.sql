CREATE TABLE IF NOT EXISTS usuarios (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS cartas (
    id VARCHAR(255) PRIMARY KEY,
    name_ig VARCHAR(255) NOT NULL,
    name_pt VARCHAR(255) NOT NULL,
    card_game ENUM('magic', 'yugioh', 'pokemon') NOT NULL,
    img_url VARCHAR(500),
    rarity ENUM('common', 'uncommon', 'rare', 'mythic', 'legendary') NOT NULL
);

CREATE TABLE IF NOT EXISTS colecao (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    id_user CHAR(36) NOT NULL,
    FOREIGN KEY (id_user) REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS colecao_carta (
    id CHAR(36) PRIMARY KEY,
    id_carta VARCHAR(255) NOT NULL,
    id_colecao CHAR(36) NOT NULL,
    FOREIGN KEY (id_carta) REFERENCES cartas(id),
    FOREIGN KEY (id_colecao) REFERENCES colecao(id)
);