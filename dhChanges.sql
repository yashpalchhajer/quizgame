
CREATE DATABASE `quizegame`;

CREATE TABLE `active_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `is_active` enum('0','1') NOT NULL,
  `is_paired` enum('0','1') NOT NULL,
  `paired_id` int(11) NOT NULL,
  `entry_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

