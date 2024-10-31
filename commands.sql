CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    url VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes)
VALUES
    ('Author One', 'https://example.com/blog1', 'First Blog Post', 5),
    ('Author Two', 'https://example.com/blog2', 'Second Blog Post', 10);