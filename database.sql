CREATE TABLE schools(
     school_id INT AUTO_INCREMENT PRIMARY KEY,
    school_name VARCHAR(150) NOT NULL,
    location VARCHAR(150)
);
CREATE TABLE users(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    level VARCHAR(20),
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    school_id INT,
    FOREIGN KEY (school_id) 
    REFERENCES schools(school_id)
);
CREATE TABLE questions(
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) ,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
);
CREATE TABLE answers(
    answer_id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT,
    user_id INT,
    answer_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (question_id)
     REFERENCES questions(question_id),
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
);
CREATE TABLE likes(
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    answer_id INT,
    user_id INT,
    
    FOREIGN KEY (answer_id) 
    REFERENCES answers(answer_id),
    
    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
);
CREATE TABLE badges(
    badge_id INT AUTO_INCREMENT PRIMARY KEY,
    badge_name VARCHAR(100) NOT NULL,
    description TEXT,
    points_required INT NOT NULL
);
CREATE TABLE user_badges(
    user_badge_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    date_earned TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) 
    REFERENCES users(user_id),
    FOREIGN KEY (badge_id)
    REFERENCES badges(badge_id)
);
CREATE TABLE followers(
    follow_id INT AUTO_INCREMENT PRIMARY KEY,
    follower_id INT NOT NULL,
    following_id INT NOT NULL,

    FOREIGN KEY (follower_id) 
    REFERENCES users(user_id),
    FOREIGN KEY (following_id) 
    REFERENCES users(user_id)
);
CREATE TABLE leaderboard(
    leaderboard_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    position INT NOT NULL,
    total_points INT DEFAULT 0,

    FOREIGN KEY (user_id) 
    REFERENCES users(user_id)
);

-- SAMPLE DATA FOR SCHOOLS
INSERT INTO schools (school_name, location)
VALUES
('Augustine University', 'Lagos'),
('University of Lagos', 'Lagos'),
('Covenant University', 'Ogun');

-- SAMPLE DATA FOR USERS
INSERT INTO users
(full_name, email, password, department, level, points)
VALUES
('John Shikin', 'john@gmail.com', '12345', 'Software Engineering', '300L', 250),
('Mary James', 'mary@gmail.com', '12345', 'Computer Science', '300L', 180),
('David Peter', 'david@gmail.com', '12345', 'Information Technology', '200L', 120),
('Sarah Johnson', 'sarah@gmail.com', '12345', 'Software Engineering', '400L', 350);

-- SAMPLE DATA FOR QUESTIONS
INSERT INTO questions
(user_id, title, description)
VALUES
(1, 'What is DBMS?', 'Can someone explain Database Management Systems?'),
(2, 'What is Normalization?',
'Please explain normalization in databases.'),
(3, 'What is an ER Diagram?',
'I need help understanding ER diagrams.'),
(4, 'What is a Foreign Key?',
'What is the purpose of a foreign key in a database?');

-- SAMPLE DATA FOR ANSWERS
INSERT INTO answers
(question_id, user_id, answer_text)
VALUES
(1, 2, 'DBMS stands for Database Management System and helps manage data efficiently.'),
(2, 1, 'Normalization is the process of reducing data redundancy in a database.'),
(3, 4, 'An ER Diagram shows entities, attributes, and relationships in a database.'),
(4, 1, 'A foreign key creates a relationship between two tables.');

-- SAMPLE DATA FOR LIKES
INSERT INTO likes
(answer_id, user_id)
VALUES
(1, 1),    
(2, 2),    
(3, 3),    
(4, 4),    
(1, 3),
(2, 2),
(3, 1),
(3, 2),
(4, 4);

-- SAMPLE DATA FOR BADGES
INSERT INTO badges (badge_name, description, points_required)
VALUES
('Beginner Helper', 'Earned after getting 50 points', 50),
('Top Contributor', 'Earned after getting 200 points', 200),
('Academic Guru', 'Earned after getting 500 points', 500);

-- SAMPLE DATA FOR USER_BADGES
INSERT INTO user_badges (user_id, badge_id)
VALUES
(1, 1),
(1, 2),
(2, 1);

-- SAMPLE DATA FOR FOLLOWERS
INSERT INTO followers (follower_id, following_id)
VALUES
(2, 1),
(3, 1),
(1, 2);

-- SAMPLE DATA FOR LEADERBOARD
INSERT INTO leaderboard (user_id, position, total_points)
VALUES
(4, 1, 350),
(1, 2, 250),
(2, 3, 180),
(3, 4, 120);
