<?php
/**
 * Template Name: Contact
 * Description: Page « Contact » — reprise de la maquette contact.html.
 *
 * Auto-application si la page a le slug `contact`.
 *
 * Branchements externes (à activer côté client) :
 *  - Filtre `labienveillance_calendly_url`  : URL Calendly à intégrer (widget inline).
 *      Ex. (à coller dans un mu-plugin ou dans functions.php d’un thème enfant) :
 *      add_filter( 'labienveillance_calendly_url', fn() => 'https://calendly.com/labienveillance/rdv' );
 *  - Filtre `labienveillance_contact_shortcode` : shortcode Contact Form 7 (ou WPForms / autre).
 *      Ex. : add_filter( 'labienveillance_contact_shortcode', fn() => '[contact-form-7 id="42" title="Contact"]' );
 *
 * Tant qu’aucune valeur n’est branchée, on retombe sur :
 *  - section Calendly absente (rien d’affiché) ;
 *  - formulaire HTML statique de la maquette + JS de simulation (`#contact-form` dans `js/main.js`).
 *
 * @package Labienveillance
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$phone_display = apply_filters( 'labienveillance_phone_display', '03 25 31 13 60' );
$phone_href    = apply_filters( 'labienveillance_phone_href', 'tel:+33325311360' );

$calendly_url   = trim( (string) apply_filters( 'labienveillance_calendly_url', '' ) );
$cf7_shortcode  = trim( (string) apply_filters( 'labienveillance_contact_shortcode', '' ) );
$contact_email  = (string) apply_filters( 'labienveillance_contact_email', 'contact@labienveillance.fr' );

if ( $calendly_url ) {
	wp_enqueue_style(
		'calendly-widget',
		'https://assets.calendly.com/assets/external/widget.css',
		array(),
		null
	);
	wp_enqueue_script(
		'calendly-widget',
		'https://assets.calendly.com/assets/external/widget.js',
		array(),
		null,
		true
	);
}

get_header();
?>

<section class="hero hero--page" id="main">
	<div class="container">
		<nav class="breadcrumb" aria-label="<?php esc_attr_e( 'Fil d’Ariane', 'labienveillance' ); ?>">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Accueil', 'labienveillance' ); ?></a><span aria-hidden="true">›</span><span><?php esc_html_e( 'Contact', 'labienveillance' ); ?></span>
		</nav>
		<h1>Contactez-nous</h1>
		<p class="hero__subtitle" style="color:rgba(255,255,255,0.85);max-width:600px;">
			Devis gratuit et sans engagement. Envoyez-nous un message, nous vous répondons rapidement.
		</p>
	</div>
</section>

<?php if ( $calendly_url ) : ?>
<section class="section calendly-section" id="prendre-rdv-calendly" aria-labelledby="calendly-title">
	<div class="container">
		<div class="text-center fade-in" style="margin-bottom:2rem;">
			<p class="section-label">Prise de rendez-vous</p>
			<h2 class="section-title" id="calendly-title">Choisir un créneau directement en ligne</h2>
			<p class="section-subtitle centered" style="max-width:640px;margin-left:auto;margin-right:auto;">
				Sélectionnez un horaire qui vous arrange&nbsp;: nous vous rappelons ou venons sur place selon votre choix.
			</p>
		</div>
		<div
			class="calendly-inline-widget fade-in"
			data-url="<?php echo esc_url( $calendly_url ); ?>"
			style="min-width:320px;height:720px;"
		></div>
	</div>
</section>
<?php endif; ?>

<section class="section" id="demander-rdv">
	<div class="container">
		<div class="contact-grid fade-in">

			<div>
				<div class="form-card">
					<h2 style="font-size:1.3rem;margin-bottom:1.25rem;">Formulaire de contact</h2>

					<?php if ( $cf7_shortcode ) : ?>
						<?php
						/**
						 * Shortcode Contact Form 7 (ou équivalent).
						 * Le rendu et l’envoi e-mail sont gérés par le plugin.
						 */
						echo do_shortcode( $cf7_shortcode ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						?>
					<?php else : ?>
						<div id="contact-form-thanks" class="contact-form-thanks" hidden role="status" aria-live="polite">
							<p class="contact-form-thanks__title">Merci, nous avons bien reçu votre message</p>
							<p>Votre demande est entre de bonnes mains. Un membre de l’équipe La Bienveillance vous recontacte <strong>sous 24 à 48 h ouvrées</strong>, par téléphone ou par e-mail selon vos préférences.</p>
							<p>En attendant, n’hésitez pas à noter notre numéro&nbsp;: <a href="<?php echo esc_url( $phone_href ); ?>"><?php echo esc_html( $phone_display ); ?></a> si vous souhaitez échanger plus vite.</p>
							<button type="button" class="btn btn--outline contact-form-thanks__btn" id="contact-form-reset">Envoyer un autre message</button>
						</div>
						<form id="contact-form" method="post" action="" data-contact-form="tbd">
							<div class="form-row">
								<div class="form-group">
									<label for="prenom">Prénom</label>
									<input type="text" id="prenom" name="prenom" required placeholder="Votre prénom">
								</div>
								<div class="form-group">
									<label for="nom">Nom</label>
									<input type="text" id="nom" name="nom" required placeholder="Votre nom">
								</div>
							</div>
							<div class="form-row">
								<div class="form-group">
									<label for="telephone">Téléphone</label>
									<input type="tel" id="telephone" name="telephone" required placeholder="03 25 ...">
								</div>
								<div class="form-group">
									<label for="email">E-mail</label>
									<input type="email" id="email" name="email" required placeholder="votre@email.fr">
								</div>
							</div>
							<div class="form-group">
								<label for="sujet">Votre demande concerne</label>
								<select id="sujet" name="sujet" required>
									<option value="" disabled selected>Choisissez un sujet</option>
									<option value="conseils">Conseils</option>
									<option value="amenagements">Aménagements</option>
									<option value="salle-de-bain">Salle de bain</option>
									<option value="monte-escaliers">Monte-escaliers</option>
									<option value="autre">Autre</option>
								</select>
							</div>
							<div class="form-group">
								<label for="message">Message</label>
								<textarea id="message" name="message" rows="5" placeholder="Décrivez votre besoin..."></textarea>
							</div>
							<button type="submit" class="btn btn--accent btn--lg" style="width:100%;">Envoyer ma demande</button>
						</form>
					<?php endif; ?>
				</div>
			</div>

			<div>
				<div class="contact-info">
					<div class="contact-info-card">
						<div class="contact-info-card__icon" aria-hidden="true">☎</div>
						<div>
							<h3>Téléphone</h3>
							<a href="<?php echo esc_url( $phone_href ); ?>" style="font-size:1.15rem;font-weight:700;color:var(--primary);"><?php echo esc_html( $phone_display ); ?></a>
							<p>Du lundi au vendredi, 9h–18h</p>
						</div>
					</div>
					<div class="contact-info-card">
						<div class="contact-info-card__icon" aria-hidden="true">✉</div>
						<div>
							<h3>E-mail</h3>
							<a href="mailto:<?php echo esc_attr( $contact_email ); ?>"><?php echo esc_html( $contact_email ); ?></a>
							<p>Réponse sous 24h</p>
						</div>
					</div>
					<div class="contact-info-card">
						<div class="contact-info-card__icon" aria-hidden="true">📍</div>
						<div>
							<h3>Intervention</h3>
							<p>Contactez-nous pour connaître les modalités d'intervention.</p>
						</div>
					</div>
					<div class="contact-info-card">
						<div class="contact-info-card__icon" aria-hidden="true">👤</div>
						<div>
							<h3>Votre interlocuteur</h3>
							<p>Gérant – La Bienveillance</p>
						</div>
					</div>
				</div>

				<div style="margin-top:2.5rem;background:var(--primary-light);border-radius:var(--radius-lg);padding:2rem;">
					<h3 style="font-size:1.1rem;margin-bottom:1rem;">Nos engagements</h3>
					<div class="service-benefits">
						<div class="service-benefit">
							<div class="service-benefit__check">✓</div>
							<p>Devis <strong>gratuit et sans engagement</strong></p>
						</div>
						<div class="service-benefit">
							<div class="service-benefit__check">✓</div>
							<p>Visite à domicile pour <strong>évaluer vos besoins</strong></p>
						</div>
						<div class="service-benefit">
							<div class="service-benefit__check">✓</div>
							<p>Accompagnement dans les <strong>demandes d'aides</strong></p>
						</div>
						<div class="service-benefit">
							<div class="service-benefit__check">✓</div>
							<p>Écoute, professionnalisme et <strong>proximité</strong></p>
						</div>
					</div>
				</div>

				<img src="<?php echo esc_url( labienveillance_img( 'visite-conseil.jpg' ) ); ?>" alt="Conseillère en visite à domicile présentant des solutions d'aménagement à un couple senior" class="hero__image" style="margin-top:2rem;" width="600" height="450" loading="lazy">
			</div>

		</div>
	</div>
</section>

<?php
get_footer();
