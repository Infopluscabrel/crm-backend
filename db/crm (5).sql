-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 23 août 2022 à 17:23
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
  `ID_FACTURE` int(11) NOT NULL,
  `CREATED_AT` datetime DEFAULT NULL,
  `UPDATED_AT` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `quantite` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `entreestock`
--

INSERT INTO `entreestock` (`id`, `id_produit`, `quantite`) VALUES
(1, 8, 10),
(2, 8, 10),
(3, 8, 10),
(4, 8, 10);

-- --------------------------------------------------------

--
-- Structure de la table `facture`
--

CREATE TABLE `facture` (
  `ID_FACTURE` int(11) NOT NULL,
  `QRCODE` varchar(254) DEFAULT NULL,
  `NET_A_PAYER` float NOT NULL,
  `CREATED_AT` datetime DEFAULT NULL,
  `UPDATED_AT` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `PROPRIETAIRE` int(11) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT NULL,
  `UPDATE_AT` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `produit`
--

INSERT INTO `produit` (`ID_PRODUIT`, `ID_CATEGORIE`, `NOM_PRODUIT`, `prix`, `QUANTITE`, `PROPRIETAIRE`, `CREATED_AT`, `UPDATE_AT`) VALUES
(1, NULL, 'kadji', 1233, 111, 1, NULL, NULL),
(2, 2, 'guiness smooth vol 2', 122, 1555, 11, '2022-08-21 12:23:57', '2022-08-21 12:23:57'),
(3, 2, 'test', 0, 1, 11, '2022-08-21 12:23:57', '2022-08-21 12:23:57'),
(4, 2, 'test', 0, 1, 11, '2022-08-21 12:23:57', '2022-08-21 12:23:57'),
(5, NULL, 'guiness smooth', 122, 111, 2, NULL, NULL),
(6, NULL, 'petite guiness ', 122, 111, 2, NULL, NULL),
(7, NULL, 'petite guiness ', 122, 111, 2, NULL, NULL),
(8, NULL, 'Grande guiness 3', 500, 1020, 1, NULL, NULL);

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
(1, 'distributeur', 1, '2022-08-08 15:02:01', '2022-08-08 15:02:01'),
(2, 'client 1', 2, '2022-08-08 15:02:01', '2022-08-08 15:02:01'),
(3, 'Client 2', 3, '2022-08-08 15:04:29', '2022-08-08 15:04:29');

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

INSERT INTO `user` (`ID_USER`, `USE_ID_USER`, `ID_ROLE`, `NOM_USER`, `LOGIN`, `email`, `PASSWORD`, `EST_LIMITE`, `MONTANT_LIMITE`, `TELEPHONE`, `CREATED_AT`, `UPDATE_AT`, `offre`, `details_offre`, `engagement`, `etat_signature`, `date_signature`, `cni`, `patente`, `nui`, `etat_validation`, `date_validation`, `etat_stock`, `date_expedition`, `adresse`, `precompte`, `ristourne`, `token`, `refresh_token`) VALUES
(1, 0, 1, 'cabrel', NULL, 'cabrelroma@tet.com', '$2a$08$JSn.oRyflREI5VRQxakvteWOQRgQ0T5vXz74BanfhCx4ozYd1M02q', 0, 0, 655194159, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 2, 2, 'cabrel', NULL, 'cabrelroma@tetet.com', '$2a$08$WcpSVd6zuFhySzYHTWZGCeAAgEyUYAspjsJgsUiyudqJCJVq6NiQi', 0, 0, 655194159, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 1, 2, '', NULL, 'roma@gmail.com', '$2a$08$hyYEy2rGrzlRCopJOf.xrOAwZsAFniDtbCLZ13HPUCm1r579PmQB2', 1, 1000000, 655194159, NULL, NULL, 'cash', 'Achat bon marche', '1000000', 1, '2022-10-08', '1', '1', '1', 1, '0000-00-00 00:00:00', '1', '0000-00-00', 'test', 2, 1, NULL, NULL),
(4, 1, 2, '', 'laroma', 'roma1@gmail.com', '$2a$08$g9OFNt2zcj3MwUS1ksBmvublPORorBleDBR74sGmDxhv9O1FgYsFO', 1, 1000000, 655194159, NULL, NULL, 'cash', 'Achat bon marche', '1000000', 1, '2022-10-08', '1', '1', '1', 1, '0000-00-00 00:00:00', '1', '0000-00-00', 'test', 2, 1, NULL, NULL),
(5, 1, 2, 'undefined', 'undefined', 'ddd@gmail.com', '$2a$08$pcVKZ9KVI0.RR8gqqhnNoOlF4aY1b35YVevQ/clPqp5pXAMMFJKiG', 0, 200000, 0, NULL, NULL, '', 'Achat bon marche', '1000000', 1, '0000-00-00', '1', '1', '1', 1, '0000-00-00 00:00:00', '1', '0000-00-00', 'test', 2, 1, NULL, NULL),
(8, 1, 2, '', 'tech', 'roma2@gmail.com', '$2a$08$5aymz9IQ01vp7M4zx9QOUeZtbi/h50imsXJTYCUgMC.D0JbwMdKpK', 1, 1000000, 655194159, '2022-08-22 11:37:24', NULL, 'cash', 'Achat bon marche', '1000000', 1, '2022-10-08', '1', '1', '1', 1, '0000-00-00 00:00:00', '1', '0000-00-00', 'test', 2, 1, NULL, NULL);

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
  ADD PRIMARY KEY (`ID_COMMANDE`),
  ADD KEY `FK_avoir` (`ID_FACTURE`);

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
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `entreestock`
--
ALTER TABLE `entreestock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `produit`
--
ALTER TABLE `produit`
  MODIFY `ID_PRODUIT` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `ID_USER` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

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
