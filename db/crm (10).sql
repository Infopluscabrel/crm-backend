-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 02 sep. 2022 à 14:10
-- Version du serveur : 10.4.22-MariaDB
-- Version de PHP : 8.0.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `crm`
--

-- --------------------------------------------------------

--
-- Structure de la table `categorie_produit`
--

CREATE TABLE `categorie_produit` (
  `ID_CATEGORIE` int(11) NOT NULL,
  `LIBELLE` varchar(254) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT NULL,
  `UPDATE_AT` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `commande`
--

CREATE TABLE `commande` (
  `ID_COMMANDE` int(11) NOT NULL,
  `total` float DEFAULT NULL,
  `payment_status` tinyint(4) NOT NULL DEFAULT 0,
  `moyen_paiement` float DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT NULL,
  `UPDATED_AT` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `commande`
--

INSERT INTO `commande` (`ID_COMMANDE`, `total`, `payment_status`, `moyen_paiement`, `CREATED_AT`, `UPDATED_AT`) VALUES
(0, NULL, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `compte`
--

CREATE TABLE `compte` (
  `ID_COMPTE` datetime NOT NULL,
  `CREATED_AT` datetime DEFAULT NULL,
  `UPDATED_AT` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `concerner`
--

CREATE TABLE `concerner` (
  `ID_PRODUIT` int(11) NOT NULL,
  `ID_COMMANDE` int(11) NOT NULL,
  `QUANTITE` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `configuration`
--

CREATE TABLE `configuration` (
  `tva` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `entreestock`
--

CREATE TABLE `entreestock` (
  `id` int(11) NOT NULL,
  `id_produit` int(11) NOT NULL,
  `quantite` int(11) NOT NULL,
  `proprietaire` int(11) NOT NULL,
  `CREATED_AT` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `entreestock`
--

INSERT INTO `entreestock` (`id`, `id_produit`, `quantite`, `proprietaire`, `CREATED_AT`) VALUES
(1, 8, 10, 0, '2022-08-23 17:26:09'),
(2, 8, 10, 0, '2022-08-23 17:26:09'),
(3, 8, 10, 0, '2022-08-23 17:26:09'),
(4, 8, 10, 0, '2022-08-23 17:26:09'),
(5, 0, 3, 0, '2022-09-01 17:38:09'),
(6, 0, 3, 0, '2022-09-01 17:38:33'),
(7, 2, 3, 0, '2022-09-01 17:39:29');

-- --------------------------------------------------------

--
-- Structure de la table `facture`
--

CREATE TABLE `facture` (
  `ID_FACTURE` int(11) NOT NULL,
  `QRCODE` varchar(254) DEFAULT NULL,
  `NET_A_PAYER` float NOT NULL,
  `id_commande` int(11) NOT NULL,
  `CREATED_AT` datetime DEFAULT NULL,
  `UPDATED_AT` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `ligne_commande`
--

CREATE TABLE `ligne_commande` (
  `id` int(11) NOT NULL,
  `id_produit` int(11) NOT NULL,
  `quantite` int(11) NOT NULL,
  `id_vente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `ligne_commande`
--

INSERT INTO `ligne_commande` (`id`, `id_produit`, `quantite`, `id_vente`) VALUES
(1, 1, 2, 1),
(2, 2, 3, 1),
(3, 4, 3, 1),
(4, 5, 40, 2),
(5, 1, 40, 10),
(6, 2, 5, 10),
(7, 4, 5, 10);

-- --------------------------------------------------------

--
-- Structure de la table `passer`
--

CREATE TABLE `passer` (
  `ID_COMMANDE` int(11) NOT NULL,
  `ID_USER` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `produit`
--

CREATE TABLE `produit` (
  `ID_PRODUIT` int(11) NOT NULL,
  `ID_CATEGORIE` int(11) DEFAULT NULL,
  `NOM_PRODUIT` varchar(254) DEFAULT NULL,
  `prix` float NOT NULL,
  `QUANTITE` int(11) DEFAULT NULL,
  `qte_grossiste` float DEFAULT 0,
  `qte_detaillant` float DEFAULT 0,
  `PROPRIETAIRE` int(11) DEFAULT NULL,
  `id_grossiste` int(11) DEFAULT 0,
  `id_detaillant` int(11) DEFAULT 0,
  `CREATED_AT` datetime DEFAULT current_timestamp(),
  `UPDATE_AT` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `produit`
--

INSERT INTO `produit` (`ID_PRODUIT`, `ID_CATEGORIE`, `NOM_PRODUIT`, `prix`, `QUANTITE`, `qte_grossiste`, `qte_detaillant`, `PROPRIETAIRE`, `id_grossiste`, `id_detaillant`, `CREATED_AT`, `UPDATE_AT`) VALUES
(1, NULL, 'kadji', 1233, -180, 200, 40, 1, 4, 0, NULL, NULL),
(2, 2, 'guiness smooth vol 2', 122, 65, 25, 5, 1, 4, 0, '2022-08-21 12:23:57', '2022-08-21 12:23:57'),
(3, 2, 'test', 0, 1, 0, 0, 11, 0, 0, '2022-08-21 12:23:57', '2022-08-21 12:23:57'),
(4, 2, 'test', 0, 65, 25, 5, 11, 4, 0, '2022-08-21 12:23:57', '2022-08-21 12:23:57'),
(5, NULL, 'guiness smooth', 122, 111, NULL, 0, 4, 0, 0, NULL, NULL),
(6, NULL, 'petite guiness ', 122, 111, NULL, 0, 4, 0, 0, NULL, NULL),
(7, NULL, 'petite guiness ', 122, 111, NULL, 0, 2, 0, 0, NULL, NULL),
(8, NULL, 'Grande guiness 3', 500, 1020, NULL, 0, 1, 0, 0, NULL, NULL),
(9, NULL, '', 0, 4, NULL, 0, 0, 0, 0, '2022-08-24 15:11:51', NULL),
(10, NULL, '', 0, 4, NULL, 0, 0, 0, 0, '2022-08-24 15:15:10', NULL),
(11, NULL, '', 0, 0, NULL, 0, 0, 0, 0, '2022-08-29 13:00:34', NULL),
(12, NULL, 'guiness smooth', 122, 111, NULL, 0, 2, 0, 0, '2022-09-01 18:41:45', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `roles`
--

CREATE TABLE `roles` (
  `ID_ROLE` int(11) NOT NULL,
  `LIBELLE` varchar(254) DEFAULT NULL,
  `NIVEAU` int(11) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT NULL,
  `UPDATED_AT` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `roles`
--

INSERT INTO `roles` (`ID_ROLE`, `LIBELLE`, `NIVEAU`, `CREATED_AT`, `UPDATED_AT`) VALUES
(0, 'admin', 1000, '2022-08-29 18:51:43', '2022-08-29 18:51:43'),
(1, 'distributeur', 1, '2022-08-08 15:02:01', '2022-08-08 15:02:01'),
(2, 'client 1', 2, '2022-08-08 15:02:01', '2022-08-08 15:02:01'),
(3, 'Client 2', 3, '2022-08-08 15:04:29', '2022-08-08 15:04:29'),
(4, 'admin', 1000, '2022-08-29 18:52:51', '2022-08-29 18:52:51');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `ID_USER` int(11) NOT NULL,
  `USE_ID_USER` int(11) NOT NULL,
  `ID_ROLE` int(11) NOT NULL,
  `NOM_USER` varchar(254) DEFAULT NULL,
  `LOGIN` varchar(200) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `PASSWORD` varchar(255) NOT NULL,
  `date_naissance` date DEFAULT NULL,
  `EST_LIMITE` tinyint(1) DEFAULT NULL,
  `MONTANT_LIMITE` int(11) DEFAULT NULL,
  `TELEPHONE` int(11) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT current_timestamp(),
  `UPDATE_AT` datetime DEFAULT NULL,
  `offre` varchar(100) DEFAULT NULL,
  `details_offre` varchar(255) DEFAULT NULL,
  `engagement` varchar(255) DEFAULT NULL,
  `etat_signature` tinyint(4) DEFAULT NULL,
  `date_signature` date DEFAULT NULL,
  `cni` varchar(255) DEFAULT NULL,
  `patente` varchar(255) DEFAULT NULL,
  `nui` varchar(255) DEFAULT NULL,
  `etat_validation` tinyint(4) DEFAULT NULL,
  `date_validation` timestamp NULL DEFAULT NULL,
  `etat_stock` varchar(255) DEFAULT NULL,
  `date_expedition` date DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `precompte` float DEFAULT NULL,
  `ristourne` float DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `refresh_token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`ID_USER`, `USE_ID_USER`, `ID_ROLE`, `NOM_USER`, `LOGIN`, `email`, `PASSWORD`, `date_naissance`, `EST_LIMITE`, `MONTANT_LIMITE`, `TELEPHONE`, `CREATED_AT`, `UPDATE_AT`, `offre`, `details_offre`, `engagement`, `etat_signature`, `date_signature`, `cni`, `patente`, `nui`, `etat_validation`, `date_validation`, `etat_stock`, `date_expedition`, `adresse`, `precompte`, `ristourne`, `token`, `refresh_token`) VALUES
(1, 0, 1, 'cabrel', 'cabrel', 'cabrelroma@tet.com', '$2a$08$g9OFNt2zcj3MwUS1ksBmvublPORorBleDBR74sGmDxhv9O1FgYsFO', NULL, 0, 0, 655194159, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 2, 2, 'cabrel', NULL, 'cabrelroma@tetet.com', '$2a$08$WcpSVd6zuFhySzYHTWZGCeAAgEyUYAspjsJgsUiyudqJCJVq6NiQi', NULL, 0, 0, 655194159, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 1, 2, '', NULL, 'roma@gmail.com', '$2a$08$hyYEy2rGrzlRCopJOf.xrOAwZsAFniDtbCLZ13HPUCm1r579PmQB2', NULL, 1, 1000000, 655194159, NULL, NULL, 'cash', 'Achat bon marche', '1000000', 1, '2022-10-08', '1', '1', '1', 1, '0000-00-00 00:00:00', '1', '0000-00-00', 'test', 2, 1, NULL, NULL),
(4, 1, 2, '', 'laroma', 'roma1@gmail.com', '$2a$08$g9OFNt2zcj3MwUS1ksBmvublPORorBleDBR74sGmDxhv9O1FgYsFO', '2000-10-10', 1, 1000000, 655194159, NULL, NULL, 'cash', 'Achat bon marche', '1000000', 1, '2022-10-08', '1', '1', '1', 1, '0000-00-00 00:00:00', '1', '0000-00-00', 'test', 2, 1, NULL, NULL),
(5, 1, 2, 'undefined', 'undefined', 'ddd@gmail.com', '$2a$08$pcVKZ9KVI0.RR8gqqhnNoOlF4aY1b35YVevQ/clPqp5pXAMMFJKiG', NULL, 0, 200000, 0, NULL, NULL, '', 'Achat bon marche', '1000000', 1, '0000-00-00', '1', '1', '1', 1, '0000-00-00 00:00:00', '1', '0000-00-00', 'test', 2, 1, NULL, NULL),
(8, 1, 2, '', 'tech', 'roma2@gmail.com', '$2a$08$5aymz9IQ01vp7M4zx9QOUeZtbi/h50imsXJTYCUgMC.D0JbwMdKpK', NULL, 1, 1000000, 655194159, '2022-08-22 11:37:24', NULL, 'cash', 'Achat bon marche', '1000000', 1, '2022-10-08', '1', '1', '1', 1, '0000-00-00 00:00:00', '1', '0000-00-00', 'test', 2, 1, NULL, NULL),
(9, 0, 2, '', '', 'etot@paiecash.com', '$2a$08$7//wlAUDiUopqfezyae8neAtcmp4Fv0YMzVAIu1WdVLsD.v.X1k8K', NULL, 1, 1000000, 697660273, '2022-08-24 12:27:00', NULL, 'cash', 'admin', '1000000', 1, '2022-10-08', '1', '1', '1', 1, '0000-00-00 00:00:00', '1', '0000-00-00', 'test', 2, 1, NULL, NULL),
(10, 1, 2, 'newtest', 'ntest', 'ntest@g.com', 'test', NULL, NULL, NULL, NULL, '2022-08-31 16:09:20', '2022-08-31 17:07:56', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(14, 1, 1, 'monest', 'monest', 'monest@f', 'monest', '2022-08-02', 0, 0, 0, '2022-08-31 17:42:01', '2022-08-31 18:40:35', '0', '0', '0', 0, '0000-00-00', '00', '0', NULL, 0, '2022-08-22 16:40:36', '0', '2022-08-10', '0', 0, 0, '0', '0'),
(20, 1, 1, 'monddest', 'monddest', 'monedst@df', 'monedst', '2022-08-02', 0, 0, 0, '2022-08-31 18:40:35', '2022-08-31 18:40:35', '0', '0', '0', 0, '2022-08-22', '2022-08-22 17:40:36', '2022-08-22 17:40:36', NULL, 0, '2022-08-22 16:40:36', '0', '2022-08-10', '0', 0, 0, '0', '0'),
(22, 1, 2, '', 'celarine', 'celarine@gmail.com', '$2a$08$MXmp770M03VhALG8bVgP8un9yrs5qs1HboutFAi/8B8cAquu6k8de', NULL, 1, 1000000, 655194159, '2022-09-01 18:12:38', NULL, 'cash', 'Achat bon marche', '1000000', 1, '2022-10-08', '1', '1', '1', 1, '0000-00-00 00:00:00', '1', '0000-00-00', 'test', 2, 1, NULL, NULL),
(23, 1, 2, '', 'celarine2', 'celarine2@gmail.com', '$2a$08$yOIk2jL/cP1iqDP/0xkXGeOkhG91DrBgvku27UW2JpAJwN4TzNj1e', NULL, 1, 1000000, 655194159, '2022-09-01 18:12:55', NULL, 'cash', 'Achat bon marche', '1000000', 1, '2022-10-08', '1', '1', '1', 1, '0000-00-00 00:00:00', '1', '0000-00-00', 'test', 2, 1, NULL, NULL),
(24, 1, 2, '', 'celarine3', 'celarine3@gmail.com', '$2a$08$Opjsxgy0HZw0fPaMHWdplevZSxskSJpYDRzzKARTflkFjt/HKdvWe', NULL, 1, 1000000, 655194159, '2022-09-01 18:13:10', NULL, 'cash', 'Achat bon marche', '1000000', 1, '2022-10-08', '1', '1', '1', 1, '0000-00-00 00:00:00', '1', '0000-00-00', 'test', 2, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `vente`
--

CREATE TABLE `vente` (
  `id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT '0',
  `payment_status` tinyint(4) NOT NULL DEFAULT 0,
  `user_id` int(11) NOT NULL,
  `CREATED_AT` date NOT NULL DEFAULT current_timestamp(),
  `UPDATED_AT` date NOT NULL,
  `total` float DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `vente`
--

INSERT INTO `vente` (`id`, `status`, `payment_status`, `user_id`, `CREATED_AT`, `UPDATED_AT`, `total`) VALUES
(1, '1', 0, 4, '2022-08-24', '0000-00-00', 1000),
(2, '0', 0, 4, '2022-08-24', '0000-00-00', 1000),
(3, '0', 0, 4, '2022-08-29', '0000-00-00', 1000),
(4, '0', 0, 7, '2022-08-30', '0000-00-00', 0),
(5, '0', 0, 7, '2022-08-31', '0000-00-00', 0),
(6, '0', 0, 7, '2022-09-01', '0000-00-00', 0),
(7, '0', 0, 7, '2022-09-01', '0000-00-00', 0),
(8, '0', 0, 7, '2022-09-01', '0000-00-00', 0),
(9, '0', 0, 7, '2022-09-01', '0000-00-00', 0),
(10, '1', 0, 7, '2022-09-01', '0000-00-00', 0);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `categorie_produit`
--
ALTER TABLE `categorie_produit`
  ADD PRIMARY KEY (`ID_CATEGORIE`);

--
-- Index pour la table `commande`
--
ALTER TABLE `commande`
  ADD PRIMARY KEY (`ID_COMMANDE`);

--
-- Index pour la table `compte`
--
ALTER TABLE `compte`
  ADD PRIMARY KEY (`ID_COMPTE`);

--
-- Index pour la table `concerner`
--
ALTER TABLE `concerner`
  ADD PRIMARY KEY (`ID_PRODUIT`,`ID_COMMANDE`),
  ADD KEY `FK_concerner` (`ID_COMMANDE`);

--
-- Index pour la table `entreestock`
--
ALTER TABLE `entreestock`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `facture`
--
ALTER TABLE `facture`
  ADD PRIMARY KEY (`ID_FACTURE`);

--
-- Index pour la table `ligne_commande`
--
ALTER TABLE `ligne_commande`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `passer`
--
ALTER TABLE `passer`
  ADD PRIMARY KEY (`ID_COMMANDE`,`ID_USER`);

--
-- Index pour la table `produit`
--
ALTER TABLE `produit`
  ADD PRIMARY KEY (`ID_PRODUIT`);

--
-- Index pour la table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`ID_ROLE`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`ID_USER`),
  ADD UNIQUE KEY `LOGIN` (`LOGIN`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `vente`
--
ALTER TABLE `vente`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `entreestock`
--
ALTER TABLE `entreestock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `ligne_commande`
--
ALTER TABLE `ligne_commande`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `produit`
--
ALTER TABLE `produit`
  MODIFY `ID_PRODUIT` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `ID_USER` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT pour la table `vente`
--
ALTER TABLE `vente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `commande`
--
ALTER TABLE `commande`
  ADD CONSTRAINT `FK_avoir` FOREIGN KEY (`ID_FACTURE`) REFERENCES `facture` (`ID_FACTURE`);

--
-- Contraintes pour la table `concerner`
--
ALTER TABLE `concerner`
  ADD CONSTRAINT `FK_concerner` FOREIGN KEY (`ID_COMMANDE`) REFERENCES `commande` (`ID_COMMANDE`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
