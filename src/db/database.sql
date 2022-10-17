-- phpMyAdmin SQL Dump
-- version 4.6.6deb5ubuntu0.5
-- https://www.phpmyadmin.net/
--
-- Client :  localhost:3306
-- Généré le :  Lun 17 Octobre 2022 à 09:08
-- Version du serveur :  5.7.39-0ubuntu0.18.04.2
-- Version de PHP :  7.2.24-0ubuntu0.18.04.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `crm`
--

-- --------------------------------------------------------

--
-- Structure de la table `categorie_produit`
--

CREATE TABLE `categorie_produit` (
  `id_categorie` int(11) NOT NULL,
  `libelle` varchar(200) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `delete_date` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `configuration`
--

CREATE TABLE `configuration` (
  `id_conf` int(11) NOT NULL,
  `tva` float NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `entree_stock`
--

CREATE TABLE `entree_stock` (
  `id_es` int(11) NOT NULL,
  `quantite` int(11) NOT NULL,
  `unit` enum('BOUTEILLE PLASTIQUE','BOUTEILLE EN VERRE','CASIER','PALETTE','BRIQUE','CARTON') NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `stock_id` int(11) DEFAULT NULL,
  `proprietaire` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `facture`
--

CREATE TABLE `facture` (
  `id_facture` int(11) NOT NULL,
  `qrcode` varchar(255) DEFAULT NULL,
  `net_a_payer` double NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `ligne_commande`
--

CREATE TABLE `ligne_commande` (
  `id_lc` int(11) NOT NULL,
  `quantite` int(11) NOT NULL,
  `unit` enum('BOUTEILLE PLASTIQUE','BOUTEILLE EN VERRE','CASIER','PALETTE','BRIQUE','CARTON') NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `delete_date` datetime(6) DEFAULT NULL,
  `prod_id` int(11) DEFAULT NULL,
  `stock_id` int(11) DEFAULT NULL,
  `vente_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `produit`
--

CREATE TABLE `produit` (
  `id_produit` int(11) NOT NULL,
  `nom_produit` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `delete_date` datetime(6) DEFAULT NULL,
  `catProdIdCategorie` int(11) DEFAULT NULL,
  `profil_produit` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

CREATE TABLE `role` (
  `id_role` int(11) NOT NULL,
  `libelle` varchar(30) NOT NULL,
  `niveau` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `delete_date` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `role`
--

INSERT INTO `role` (`id_role`, `libelle`, `niveau`, `created_at`, `updated_at`, `delete_date`) VALUES
(1, 'ADMIN', 1000, '2022-10-15 13:19:45.535984', '2022-10-15 13:19:45.535984', NULL),
(2, 'DISTRIBUTEUR', 1, '2022-10-15 13:20:15.426613', '2022-10-15 13:20:15.426613', NULL),
(3, 'GROSSISTE', 2, '2022-10-15 13:20:28.429980', '2022-10-15 13:20:28.429980', NULL),
(4, 'DETAILLANT', 3, '2022-10-15 13:20:40.666276', '2022-10-15 13:20:40.666276', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `stock`
--

CREATE TABLE `stock` (
  `id_stock` int(11) NOT NULL,
  `prix_unite` double NOT NULL,
  `quantite` int(11) NOT NULL,
  `unit` enum('BOUTEILLE PLASTIQUE','BOUTEILLE EN VERRE','CASIER','PALETTE','BRIQUE','CARTON') NOT NULL,
  `validation` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `delete_date` datetime(6) DEFAULT NULL,
  `prod_id` int(11) DEFAULT NULL,
  `proprietaire` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `login` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date_naissance` datetime DEFAULT NULL,
  `est_limite` tinyint(4) NOT NULL DEFAULT '0',
  `montant_limite` tinyint(4) DEFAULT NULL,
  `telephone` varchar(12) NOT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `cni_recto` varchar(255) DEFAULT NULL,
  `cni_verso` varchar(255) DEFAULT NULL,
  `offre` varchar(100) DEFAULT NULL,
  `detail_offre` varchar(255) DEFAULT NULL,
  `engagement` varchar(255) DEFAULT NULL,
  `etat_stock` varchar(255) DEFAULT NULL,
  `etat_signature` tinyint(4) DEFAULT NULL,
  `date_signature` datetime DEFAULT NULL,
  `validation` tinyint(4) DEFAULT NULL,
  `patente` varchar(255) DEFAULT NULL,
  `nui` varchar(255) DEFAULT NULL,
  `etat_validation` varchar(255) DEFAULT NULL,
  `date_validation` datetime DEFAULT NULL,
  `date_expiration` datetime DEFAULT NULL,
  `precompte` float DEFAULT NULL,
  `ristorne` float DEFAULT NULL,
  `date_connexion` datetime DEFAULT NULL,
  `IdOauth` varchar(255) DEFAULT NULL,
  `mode_login` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `delet_date` datetime(6) DEFAULT NULL,
  `roleIdRole` int(11) DEFAULT NULL,
  `parrainIdUser` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Contenu de la table `user`
--

INSERT INTO `user` (`id_user`, `nom`, `prenom`, `login`, `email`, `password`, `date_naissance`, `est_limite`, `montant_limite`, `telephone`, `adresse`, `image`, `cni_recto`, `cni_verso`, `offre`, `detail_offre`, `engagement`, `etat_stock`, `etat_signature`, `date_signature`, `validation`, `patente`, `nui`, `etat_validation`, `date_validation`, `date_expiration`, `precompte`, `ristorne`, `date_connexion`, `IdOauth`, `mode_login`, `created_at`, `updated_at`, `delet_date`, `roleIdRole`, `parrainIdUser`) VALUES
(1, 'FOTSING', 'Paulin', 'Paulin', 'paulinlenasaein@gmail.com', '$2b$10$sLrblkvmUyzS0itTqvGyR.Yfw57VmgXMak9cp.89Hvc3uWxQxAsXS', NULL, 0, NULL, '656003276', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2022-10-16 23:28:40', NULL, NULL, '2022-10-16 23:23:01.589139', '2022-10-16 23:28:39.000000', NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `vente`
--

CREATE TABLE `vente` (
  `id_vente` int(11) NOT NULL,
  `paiement_status` enum('INIT','SUCCESS','FAILDE') NOT NULL DEFAULT 'INIT',
  `total` double NOT NULL,
  `type` enum('VENTE_SIMPLE','COMMANDE') NOT NULL,
  `moyen_paiement` enum('CASH','PAIE_CASH','ORANGE MONEY','MTN MOBILE MONEY') NOT NULL,
  `date_paiement` timestamp NULL DEFAULT NULL,
  `validee` int(11) NOT NULL DEFAULT '0',
  `date_validation` timestamp NULL DEFAULT NULL,
  `livree` int(11) NOT NULL DEFAULT '0',
  `date_livraison` timestamp NULL DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_date` datetime(6) DEFAULT NULL,
  `facture_id` int(11) DEFAULT NULL,
  `from_user_id` int(11) DEFAULT NULL,
  `to_user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `categorie_produit`
--
ALTER TABLE `categorie_produit`
  ADD PRIMARY KEY (`id_categorie`);

--
-- Index pour la table `configuration`
--
ALTER TABLE `configuration`
  ADD PRIMARY KEY (`id_conf`);

--
-- Index pour la table `entree_stock`
--
ALTER TABLE `entree_stock`
  ADD PRIMARY KEY (`id_es`),
  ADD UNIQUE KEY `REL_ae015f89525a6904dbb28c0257` (`stock_id`),
  ADD KEY `FK_68f8d007fc674bcf45560c929ca` (`proprietaire`);

--
-- Index pour la table `facture`
--
ALTER TABLE `facture`
  ADD PRIMARY KEY (`id_facture`);

--
-- Index pour la table `ligne_commande`
--
ALTER TABLE `ligne_commande`
  ADD PRIMARY KEY (`id_lc`),
  ADD UNIQUE KEY `REL_76ddc92812aa10da18647e4ae4` (`prod_id`),
  ADD UNIQUE KEY `REL_f50c2466142ebaae2883683c77` (`stock_id`),
  ADD KEY `FK_f9692b0abf9ec5e704a2d7d1d11` (`vente_id`);

--
-- Index pour la table `produit`
--
ALTER TABLE `produit`
  ADD PRIMARY KEY (`id_produit`),
  ADD KEY `FK_87b3276715b078e579306770d2b` (`catProdIdCategorie`);

--
-- Index pour la table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id_role`);

--
-- Index pour la table `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id_stock`),
  ADD UNIQUE KEY `REL_a1213a9c6617112c2af9d90858` (`prod_id`),
  ADD KEY `FK_2aa9c259d4d75adb5f6f511c795` (`proprietaire`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `IDX_a62473490b3e4578fd683235c5` (`login`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  ADD UNIQUE KEY `IDX_638bac731294171648258260ff` (`password`),
  ADD UNIQUE KEY `REL_a1593630f77a7bcbd58aa4a465` (`roleIdRole`),
  ADD UNIQUE KEY `REL_27a3048e8f0208fa9adb0ff83c` (`parrainIdUser`);

--
-- Index pour la table `vente`
--
ALTER TABLE `vente`
  ADD PRIMARY KEY (`id_vente`),
  ADD UNIQUE KEY `REL_ebfa7f489cb6ff251f4d1c6430` (`facture_id`),
  ADD KEY `FK_bc0dde2e7ddfcbbadd1b9b0a28f` (`from_user_id`),
  ADD KEY `FK_f2e4e0944dead6318b89618477f` (`to_user_id`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `categorie_produit`
--
ALTER TABLE `categorie_produit`
  MODIFY `id_categorie` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `configuration`
--
ALTER TABLE `configuration`
  MODIFY `id_conf` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `entree_stock`
--
ALTER TABLE `entree_stock`
  MODIFY `id_es` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `facture`
--
ALTER TABLE `facture`
  MODIFY `id_facture` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `ligne_commande`
--
ALTER TABLE `ligne_commande`
  MODIFY `id_lc` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `produit`
--
ALTER TABLE `produit`
  MODIFY `id_produit` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `role`
--
ALTER TABLE `role`
  MODIFY `id_role` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT pour la table `stock`
--
ALTER TABLE `stock`
  MODIFY `id_stock` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT pour la table `vente`
--
ALTER TABLE `vente`
  MODIFY `id_vente` int(11) NOT NULL AUTO_INCREMENT;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `entree_stock`
--
ALTER TABLE `entree_stock`
  ADD CONSTRAINT `FK_68f8d007fc674bcf45560c929ca` FOREIGN KEY (`proprietaire`) REFERENCES `user` (`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_ae015f89525a6904dbb28c02572` FOREIGN KEY (`stock_id`) REFERENCES `stock` (`id_stock`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Contraintes pour la table `ligne_commande`
--
ALTER TABLE `ligne_commande`
  ADD CONSTRAINT `FK_76ddc92812aa10da18647e4ae43` FOREIGN KEY (`prod_id`) REFERENCES `produit` (`id_produit`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_f50c2466142ebaae2883683c776` FOREIGN KEY (`stock_id`) REFERENCES `stock` (`id_stock`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_f9692b0abf9ec5e704a2d7d1d11` FOREIGN KEY (`vente_id`) REFERENCES `vente` (`id_vente`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Contraintes pour la table `produit`
--
ALTER TABLE `produit`
  ADD CONSTRAINT `FK_87b3276715b078e579306770d2b` FOREIGN KEY (`catProdIdCategorie`) REFERENCES `categorie_produit` (`id_categorie`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `FK_2aa9c259d4d75adb5f6f511c795` FOREIGN KEY (`proprietaire`) REFERENCES `user` (`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_a1213a9c6617112c2af9d908584` FOREIGN KEY (`prod_id`) REFERENCES `produit` (`id_produit`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_27a3048e8f0208fa9adb0ff83c1` FOREIGN KEY (`parrainIdUser`) REFERENCES `user` (`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_a1593630f77a7bcbd58aa4a4655` FOREIGN KEY (`roleIdRole`) REFERENCES `role` (`id_role`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `vente`
--
ALTER TABLE `vente`
  ADD CONSTRAINT `FK_bc0dde2e7ddfcbbadd1b9b0a28f` FOREIGN KEY (`from_user_id`) REFERENCES `user` (`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_ebfa7f489cb6ff251f4d1c64305` FOREIGN KEY (`facture_id`) REFERENCES `facture` (`id_facture`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_f2e4e0944dead6318b89618477f` FOREIGN KEY (`to_user_id`) REFERENCES `user` (`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
