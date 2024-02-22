CREATE TABLE users (
    google_id VARCHAR PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL 
        CHECK (position('@' IN email) > 1),
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
  );

CREATE TABLE nhl_games (
    game_id VARCHAR PRIMARY KEY
);


CREATE TABLE nhl_games_users(
    game_id VARCHAR
        REFERENCES nhl_games ON DELETE CASCADE,
    google_id VARCHAR
        REFERENCES users ON DELETE CASCADE,    
    PRIMARY KEY (google_id, game_id)
);