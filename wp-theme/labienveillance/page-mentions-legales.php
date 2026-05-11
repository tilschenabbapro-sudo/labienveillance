<?php
/**
 * Template Name: Mentions légales
 * Description: Page « Politique de confidentialité et cookies ».
 *
 * Auto-application si la page a le slug `mentions-legales`.
 *
 * Le contenu ci-dessous est volontairement limité à la confidentialité, aux
 * cookies et aux droits des utilisateurs (RGPD). Les mentions LCEN relatives
 * à l'éditeur (raison sociale, SIRET, hébergeur, directeur de publication)
 * ne sont pas affichées tant que les informations officielles du client
 * n'ont pas été fournies, afin de ne laisser aucun champ « à compléter »
 * visible côté visiteur. Elles devront être ajoutées dès que possible
 * pour être complet vis-à-vis de la loi du 21 juin 2004.
 *
 * @package Labienveillance
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$contact_email = (string) apply_filters( 'labienveillance_contact_email', 'contact@labienveillance.fr' );
$phone_display = (string) apply_filters( 'labienveillance_phone_display', '03 25 31 13 60' );
$phone_href    = (string) apply_filters( 'labienveillance_phone_href', '+33325311360' );

get_header();
?>

<section class="hero hero--page" id="main">
	<div class="container">
		<nav class="breadcrumb" aria-label="<?php esc_attr_e( 'Fil d’Ariane', 'labienveillance' ); ?>">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Accueil', 'labienveillance' ); ?></a><span aria-hidden="true">›</span><span><?php esc_html_e( 'Confidentialité', 'labienveillance' ); ?></span>
		</nav>
		<h1><?php esc_html_e( 'Politique de confidentialité et cookies', 'labienveillance' ); ?></h1>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="legal-content fade-in">

			<p>
				La Bienveillance attache de l’importance au respect de votre vie privée.
				La présente politique décrit comment vos données personnelles sont collectées
				et traitées sur le site labienveillance.fr, conformément au Règlement (UE)&nbsp;2016/679
				dit « RGPD » et à la loi Informatique et Libertés du 6&nbsp;janvier&nbsp;1978 modifiée.
			</p>

			<h2>1. Responsable du traitement</h2>
			<p>
				<strong>La Bienveillance</strong><br>
				E-mail&nbsp;: <a href="mailto:<?php echo esc_attr( $contact_email ); ?>"><?php echo esc_html( $contact_email ); ?></a><br>
				Téléphone&nbsp;: <a href="tel:<?php echo esc_attr( $phone_href ); ?>"><?php echo esc_html( $phone_display ); ?></a>
			</p>

			<h2>2. Données collectées</h2>
			<p>
				Les données personnelles collectées sur ce site sont uniquement celles
				que vous nous transmettez volontairement via nos formulaires
				(contact, demande de devis, demande de rendez&#8209;vous)&nbsp;:
			</p>
			<ul>
				<li>vos nom et prénom&nbsp;;</li>
				<li>vos coordonnées (téléphone, e-mail, et le cas échéant adresse postale du chantier)&nbsp;;</li>
				<li>les informations relatives à votre projet (type d’aménagement, photos, mesures, contraintes techniques)&nbsp;;</li>
				<li>le contenu de votre message.</li>
			</ul>
			<p>
				Sont également enregistrées, à des fins techniques et statistiques, certaines informations
				de navigation (pages consultées, type d’appareil, date et heure)&nbsp;: voir la rubrique
				« Cookies » ci-dessous.
			</p>

			<h2>3. Finalités du traitement</h2>
			<p>Vos données sont utilisées exclusivement pour&nbsp;:</p>
			<ul>
				<li>répondre à votre demande de contact, de devis ou de rendez&#8209;vous&nbsp;;</li>
				<li>préparer et assurer le suivi de votre projet (échanges, visite à domicile, étude technique, devis, intervention)&nbsp;;</li>
				<li>respecter nos obligations légales liées à l’exécution des travaux (notamment archivage du dossier en cas de litige ou de mise en jeu d’une garantie)&nbsp;;</li>
				<li>établir des statistiques anonymisées de fréquentation du site afin d’en améliorer le contenu.</li>
			</ul>

			<h2>4. Base légale</h2>
			<p>Selon le cas, le traitement de vos données repose sur&nbsp;:</p>
			<ul>
				<li>les mesures précontractuelles prises à votre demande (devis, rendez-vous)&nbsp;;</li>
				<li>l’exécution d’un contrat lorsque vous nous confiez la réalisation d’un chantier&nbsp;;</li>
				<li>nos obligations légales (durée de conservation imposée par les garanties applicables aux travaux)&nbsp;;</li>
				<li>notre intérêt légitime à mesurer et à améliorer la qualité du site.</li>
			</ul>

			<h2>5. Durée de conservation</h2>
			<ul>
				<li>Demandes restées sans suite&nbsp;: 3&nbsp;ans à compter du dernier échange&nbsp;;</li>
				<li>Dossiers clients (devis signés, chantiers réalisés)&nbsp;: 10&nbsp;ans à compter de la fin du chantier, en cohérence avec la garantie décennale et nos obligations comptables&nbsp;;</li>
				<li>Données de mesure d’audience&nbsp;: 13&nbsp;mois maximum.</li>
			</ul>

			<h2>6. Destinataires</h2>
			<p>
				Vos données sont destinées à La Bienveillance, à ses collaborateurs et, le cas échéant,
				à ses sous-traitants strictement nécessaires au bon fonctionnement du site et au traitement
				de votre demande (hébergeur, prestataire d’envoi d’e-mails, outil de mesure d’audience).
				Aucune donnée n’est vendue, louée ou cédée à des tiers à des fins commerciales.
			</p>

			<h2>7. Vos droits</h2>
			<p>Conformément au RGPD, vous disposez à tout moment des droits suivants sur vos données&nbsp;:</p>
			<ul>
				<li>droit d’accès, de rectification, d’effacement et de limitation&nbsp;;</li>
				<li>droit d’opposition au traitement&nbsp;;</li>
				<li>droit à la portabilité&nbsp;;</li>
				<li>droit de définir des directives relatives à la conservation, à l’effacement et à la communication de vos données après votre décès&nbsp;;</li>
				<li>droit d’introduire une réclamation auprès de la CNIL&nbsp;: <a href="https://www.cnil.fr" target="_blank" rel="noopener">www.cnil.fr</a>.</li>
			</ul>
			<p>
				Pour exercer ces droits, écrivez-nous à
				<a href="mailto:<?php echo esc_attr( $contact_email ); ?>"><?php echo esc_html( $contact_email ); ?></a>
				en précisant votre demande&nbsp;; une réponse vous sera apportée dans un délai d’un mois.
			</p>

			<h2>8. Sécurité</h2>
			<p>
				La Bienveillance met en œuvre les mesures techniques et organisationnelles appropriées
				pour préserver la confidentialité, l’intégrité et la disponibilité de vos données&nbsp;:
				connexion HTTPS sur l’ensemble du site, accès restreint aux personnes habilitées,
				sauvegardes régulières et hébergement en Union européenne.
			</p>

			<h2 style="margin-top:3rem;">9. Cookies</h2>
			<p>Le site utilise deux types de cookies&nbsp;:</p>
			<ul>
				<li>
					<strong>Cookies strictement nécessaires</strong>&nbsp;: ils assurent le bon fonctionnement
					du site, mémorisent vos préférences (thème clair&nbsp;/ sombre) et permettent l’envoi
					des formulaires. Ces cookies sont indispensables et ne nécessitent pas de consentement.
				</li>
				<li>
					<strong>Cookies de mesure d’audience</strong>&nbsp;: déposés via Google Tag Manager,
					ils nous aident à comprendre comment le site est consulté afin d’en améliorer
					l’ergonomie. Les données recueillies sont agrégées et ne permettent pas
					de vous identifier directement.
				</li>
			</ul>
			<p>
				Vous pouvez à tout moment configurer votre navigateur pour bloquer ou supprimer ces cookies.
				Pour en savoir plus, consultez la fiche pratique de la CNIL&nbsp;:
				<a href="https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser" target="_blank" rel="noopener">cnil.fr/fr/cookies-les-outils-pour-les-maitriser</a>.
			</p>

			<p style="margin-top:2.5rem; font-size:0.95em; color:var(--text-muted, currentColor);">
				La présente politique peut être mise à jour afin de tenir compte des évolutions
				légales ou techniques.
			</p>

		</div>
	</div>
</section>

<?php
get_footer();
