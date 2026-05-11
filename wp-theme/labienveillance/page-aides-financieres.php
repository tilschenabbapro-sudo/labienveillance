<?php
/**
 * Template Name: Aides financières
 * Description: Page « Aides financières » — reprise de la maquette aides-financieres.html.
 *
 * Auto-application si la page a le slug `aides-financieres`.
 *
 * @package Labienveillance
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$phone_display = apply_filters( 'labienveillance_phone_display', '03 25 31 13 60' );
$phone_href    = apply_filters( 'labienveillance_phone_href', 'tel:+33325311360' );

get_header();
?>

<section class="hero hero--page" id="main">
	<div class="container">
		<nav class="breadcrumb" aria-label="<?php esc_attr_e( 'Fil d’Ariane', 'labienveillance' ); ?>">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Accueil', 'labienveillance' ); ?></a><span aria-hidden="true">›</span><span>Aides financières</span>
		</nav>
		<p class="hero__cross-hub">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>#resume-aides-financieres"><?php esc_html_e( 'Résumé des aides sur l’accueil', 'labienveillance' ); ?></a>
			<span class="hero__cross-hub-sep" aria-hidden="true"> · </span>
			<a href="#faq-aides-financieres"><?php esc_html_e( 'Questions fréquentes (cette page)', 'labienveillance' ); ?></a>
		</p>
		<h1>Aides financières</h1>
		<p class="hero__subtitle" style="color:rgba(255,255,255,0.85);max-width:700px;">
			De nombreux dispositifs existent pour alléger le coût de l'adaptation de votre logement.
			Nous vous accompagnons dans toutes les démarches.
		</p>
		<div class="btn-group" style="margin-top:1.5rem;">
			<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) ); ?>" class="btn btn--white btn--lg">Étudier mes droits gratuitement</a>
			<a href="<?php echo esc_url( $phone_href ); ?>" class="btn btn--outline btn--lg" style="border-color:#fff;color:#fff;">☎ Appelez-nous</a>
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="service-intro fade-in">
			<div>
				<p class="section-label">Ne renoncez pas pour des raisons financières</p>
				<h2 class="section-title">Des aides pour financer vos travaux d'adaptation</h2>
				<p style="margin-bottom:1rem;">
					L'adaptation de votre logement représente un investissement pour votre sécurité et votre autonomie.
					Bonne nouvelle&nbsp;: de nombreuses aides publiques et privées existent pour réduire significativement
					le reste à charge.
				</p>
				<p style="margin-bottom:1rem;">
					Monte-escaliers, douches sécurisées, aménagements divers&nbsp;: de nombreux équipements peuvent être
					financés en partie grâce aux dispositifs présentés ci-dessous.
				</p>
				<p>
					Nous vous aidons à monter votre dossier d'aide et vous accompagnons gratuitement dans l'identification de vos droits.
				</p>
			</div>
			<img src="<?php echo esc_url( labienveillance_img( 'dossier-aides.jpg' ) ); ?>" alt="Dossiers d'aides financières et documents administratifs sur un bureau" class="hero__image" width="600" height="450" loading="eager">
		</div>
	</div>
</section>

<section class="section section--alt">
	<div class="container">
		<div class="text-center fade-in" style="margin-bottom:2.5rem;">
			<p class="section-label">Les dispositifs</p>
			<h2 class="section-title">Les principales aides financières</h2>
			<p class="section-subtitle centered">
				Voici les aides auxquelles vous pourriez prétendre pour l'adaptation de votre logement.
			</p>
		</div>

		<div class="guide-steps fade-in">
			<div class="guide-step">
				<div class="guide-step__number" aria-hidden="true">📋</div>
				<div>
					<h3><span class="guide-step__mini">Vous avez plus de 70 ans.</span> Crédit d'impôt de 25&nbsp;%</h3>
					<p style="margin-bottom:0.75rem;">
						Un <strong>crédit d'impôt</strong> de 25&nbsp;% est accessible pour les dépenses liées à l'accessibilité
						et à l'adaptation du logement, que vous soyez propriétaire, locataire ou hébergé gratuitement.
					</p>
					<ul>
						<li><strong>Montant max&nbsp;:</strong> 5&nbsp;000&nbsp;€ de dépenses pour une personne seule, 10&nbsp;000&nbsp;€ pour un couple (soit jusqu'à 2&nbsp;500&nbsp;€ de crédit d'impôt)</li>
						<li><strong>Équipements éligibles&nbsp;:</strong> Monte-escalier, siège de douche mural, barres de maintien, WC surélevé, robinetterie adaptée, volets roulants électriques…</li>
						<li><strong>Avantage&nbsp;:</strong> Accessible à tous, sans condition de ressources ni d'âge</li>
						<li><strong>À savoir&nbsp;:</strong> Si vous n'êtes pas imposable, l'administration vous verse la somme correspondante</li>
					</ul>
				</div>
			</div>

			<div class="guide-step">
				<div class="guide-step__number" aria-hidden="true">🏛️</div>
				<div>
					<h3>Ma Prime Adapt'</h3>
					<p style="margin-bottom:0.75rem;">
						Lancée par l'État et gérée par l'ANAH (Agence Nationale de l'Habitat), <strong>Ma Prime Adapt'</strong>
						est la principale aide pour financer l'adaptation de votre logement à la perte d'autonomie ou au handicap.
					</p>
					<ul>
						<li><strong>Qui&nbsp;?</strong> Personnes de 70 ans et plus, ou en situation de handicap (taux ≥ 50%), ou en perte d'autonomie (GIR 1 à 6)</li>
						<li><strong>Combien&nbsp;?</strong> De <strong>50&nbsp;% à 70&nbsp;%</strong> du montant des travaux selon vos revenus, dans la limite de 22&nbsp;000&nbsp;€ HT</li>
						<li><strong>Quels travaux&nbsp;?</strong> Monte-escalier, douche sécurisée, rampes, barres d'appui, revêtements antidérapants, éclairage, domotique…</li>
						<li><strong>Conditions&nbsp;:</strong> Être propriétaire occupant du logement depuis plus de 15 ans, sous conditions de ressources</li>
					</ul>
				</div>
			</div>

			<div class="guide-step">
				<div class="guide-step__number" aria-hidden="true">🤝</div>
				<div>
					<h3>APA — Allocation Personnalisée d'Autonomie</h3>
					<p style="margin-bottom:0.75rem;">
						Versée par <strong>votre département</strong>, l'APA aide les personnes âgées en perte d'autonomie
						à financer les services et les aménagements nécessaires au maintien à domicile.
					</p>
					<ul>
						<li><strong>Qui&nbsp;?</strong> Personnes de 60 ans et plus en perte d'autonomie évaluée en GIR 1 à 4</li>
						<li><strong>Comment&nbsp;?</strong> Un plan d'aide personnalisé est établi lors d'une visite à domicile par une équipe médico-sociale</li>
						<li><strong>L'APA peut financer&nbsp;:</strong> Aides humaines (aide-ménagère, auxiliaire de vie) et aménagements du logement</li>
						<li><strong>Pas de condition de ressources</strong> pour en bénéficier (le montant varie selon les revenus)</li>
					</ul>
				</div>
			</div>

			<div class="guide-step">
				<div class="guide-step__number" aria-hidden="true">💰</div>
				<div>
					<h3>TVA à taux réduit (5,5&nbsp;% ou 10&nbsp;%)</h3>
					<p style="margin-bottom:0.75rem;">
						Les travaux d'amélioration et d'adaptation du logement bénéficient d'un <strong>taux de TVA réduit</strong>
						au lieu du taux normal de 20&nbsp;%.
					</p>
					<ul>
						<li><strong>5,5&nbsp;%</strong> pour les travaux d'accessibilité (monte-escalier, douche PMR, rampes…)</li>
						<li><strong>10&nbsp;%</strong> pour les travaux d'amélioration et de transformation</li>
						<li><strong>Condition&nbsp;:</strong> Logement achevé depuis plus de 2 ans</li>
						<li><strong>Application automatique</strong> sur les factures de nos installateurs</li>
					</ul>
				</div>
			</div>

			<div class="guide-step">
				<div class="guide-step__number" aria-hidden="true">♿</div>
				<div>
					<h3>PCH — Prestation de Compensation du Handicap</h3>
					<p style="margin-bottom:0.75rem;">
						Pour les personnes en situation de handicap (avant 60 ans ou continuité après 60 ans),
						la <strong>PCH</strong> peut financer l'aménagement du logement.
					</p>
					<ul>
						<li><strong>Montant max&nbsp;:</strong> Jusqu'à 10&nbsp;000&nbsp;€ par période de 10 ans pour l'aménagement du logement</li>
						<li><strong>Prise en charge&nbsp;:</strong> 100&nbsp;% pour les revenus modestes, 80&nbsp;% au-delà</li>
						<li><strong>Demande&nbsp;:</strong> Auprès de la MDPH (Maison Départementale des Personnes Handicapées)</li>
					</ul>
				</div>
			</div>

			<div class="guide-step">
				<div class="guide-step__number" aria-hidden="true">🏦</div>
				<div>
					<h3>Aides des caisses de retraite</h3>
					<p style="margin-bottom:0.75rem;">
						Votre caisse de retraite (CARSAT, MSA, etc.) peut proposer des <strong>aides financières complémentaires</strong>
						pour l'aménagement de votre domicile.
					</p>
					<ul>
						<li><strong>Kit prévention&nbsp;:</strong> Certaines caisses financent des équipements de prévention des chutes</li>
						<li><strong>Aide à l'habitat&nbsp;:</strong> Subventions pour les travaux d'adaptation, en complément des autres aides</li>
						<li><strong>Plan d'actions personnalisé&nbsp;:</strong> Évaluation gratuite de vos besoins par un professionnel</li>
						<li><strong>Conseil&nbsp;:</strong> Contactez votre caisse pour connaître les dispositifs en vigueur</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="section section--alt">
	<div class="container">
		<div class="service-intro service-intro--reverse fade-in">
			<div>
				<p class="section-label">Notre accompagnement</p>
				<h2 class="section-title">Nous vous aidons à monter votre dossier d'aide</h2>
				<p style="margin-bottom:1.25rem;">
					Les démarches administratives peuvent sembler complexes. Nous vous accompagnons pas à pas pour
					constituer vos dossiers et présenter votre demande aux organismes compétents, gratuitement.
				</p>
				<div class="service-benefits">
					<div class="service-benefit">
						<div class="service-benefit__check">✓</div>
						<p><strong>Évaluation gratuite</strong> de vos droits lors de la visite à domicile</p>
					</div>
					<div class="service-benefit">
						<div class="service-benefit__check">✓</div>
						<p><strong>Montage complet</strong> des dossiers de demande d'aides</p>
					</div>
					<div class="service-benefit">
						<div class="service-benefit__check">✓</div>
						<p><strong>Suivi</strong> de l'avancement de vos demandes</p>
					</div>
					<div class="service-benefit">
						<div class="service-benefit__check">✓</div>
						<p><strong>Conseil personnalisé</strong> pour maximiser vos aides</p>
					</div>
				</div>
			</div>
			<img src="<?php echo esc_url( labienveillance_img( 'conseil-domicile.jpg' ) ); ?>" alt="Conseiller à domicile, homme cinquantaine, présentant un plan d'aménagement à un couple senior" class="hero__image" width="600" height="450" loading="lazy">
		</div>
	</div>
</section>

<section class="section" id="faq-aides-financieres" aria-labelledby="titre-faq-aides">
	<div class="container">
		<div class="text-center fade-in" style="margin-bottom:2.5rem;">
			<p class="section-label">Questions fréquentes</p>
			<h2 id="titre-faq-aides" class="section-title">Vos questions sur les aides</h2>
		</div>
		<div class="guide-steps fade-in">
			<div class="guide-step">
				<div class="guide-step__number">?</div>
				<div>
					<h3>Peut-on bénéficier d'un crédit d'impôt pour un monte-escalier&nbsp;?</h3>
					<p>
						Oui, un crédit d'impôt de 25&nbsp;% est accessible pour les équipements d'accessibilité et d'adaptation
						du logement (monte-escalier, douche sécurisée, barres de maintien, etc.), dans la limite de
						5&nbsp;000&nbsp;€ pour une personne seule et 10&nbsp;000&nbsp;€ pour un couple.
					</p>
				</div>
			</div>
			<div class="guide-step">
				<div class="guide-step__number">?</div>
				<div>
					<h3>Qu'est-ce que Ma Prime Adapt'&nbsp;?</h3>
					<p>
						Ma Prime Adapt' est une aide de l'ANAH destinée aux personnes âgées ou en situation de handicap
						souhaitant adapter leur logement. Elle peut couvrir de 50&nbsp;% à 70&nbsp;% du montant des travaux
						selon vos revenus, dans la limite de 22&nbsp;000&nbsp;€ HT.
					</p>
				</div>
			</div>
			<div class="guide-step">
				<div class="guide-step__number">?</div>
				<div>
					<h3>Qu'est-ce que l'APA et comment en bénéficier&nbsp;?</h3>
					<p>
						L'Allocation Personnalisée d'Autonomie (APA) est versée par le département aux personnes de 60 ans et plus
						en perte d'autonomie (GIR 1 à 4). Elle peut financer des aménagements du domicile dans le cadre
						d'un plan d'aide personnalisé. La demande se fait auprès du conseil départemental de votre lieu de résidence.
					</p>
				</div>
			</div>
			<div class="guide-step">
				<div class="guide-step__number">?</div>
				<div>
					<h3>Faut-il avancer les frais&nbsp;?</h3>
					<p>
						Cela dépend des aides. Certaines, comme Ma Prime Adapt', peuvent faire l'objet d'un
						versement anticipé. Le crédit d'impôt est déduit l'année suivante (ou versé si vous n'êtes pas imposable).
						Nous vous expliquons clairement le calendrier des versements pour chaque aide.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="quote-banner">
	<div class="container fade-in">
		<h2 style="color:#fff;margin-bottom:0.75rem;">Ne laissez pas le financement freiner votre projet</h2>
		<p style="color:rgba(255,255,255,0.85);max-width:650px;margin:0 auto 2rem;font-size:1.1rem;">
			Contactez-nous pour une étude gratuite de vos droits. Nous identifions toutes les aides
			dont vous pouvez bénéficier et nous montons vos dossiers.
		</p>
		<div class="btn-group" style="justify-content:center;">
			<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) ); ?>" class="btn btn--white btn--lg">Étudier mes droits gratuitement</a>
			<a href="<?php echo esc_url( $phone_href ); ?>" class="btn btn--outline btn--lg" style="border-color:#fff;color:#fff;">☎ <?php echo esc_html( $phone_display ); ?></a>
		</div>
	</div>
</section>

<?php
get_footer();
