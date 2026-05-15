<?php
/**
 * La Bienveillance — fonctions du thème
 *
 * @package Labienveillance
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'LABIENVEILANCE_VERSION', '0.1.6' );
define( 'LABIENVEILANCE_GTM_ID', 'GTM-NZVHPJ3Z' );
define( 'LABIENVEILANCE_JLM_DOUCHE_OPTION', 'labienveillance_jlm_douche_cfg' );

/**
 * Configurateur douche — chargement AJAX (public).
 */
function labienveillance_jlm_douche_ajax_load(): void {
	$stored = get_option( LABIENVEILANCE_JLM_DOUCHE_OPTION, '' );
	if ( is_array( $stored ) ) {
		$stored = wp_json_encode( $stored, JSON_UNESCAPED_UNICODE );
	}
	if ( ! is_string( $stored ) || '' === trim( $stored ) ) {
		$stored = '{}';
	} else {
		json_decode( $stored );
		if ( JSON_ERROR_NONE !== json_last_error() ) {
			$stored = '{}';
		}
	}

	wp_send_json_success( array( 'config' => $stored ) );
}

/**
 * Configurateur douche — sauvegarde AJAX (admin uniquement).
 */
function labienveillance_jlm_douche_ajax_save(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_send_json_error( array( 'message' => 'forbidden' ), 403 );
	}

	check_ajax_referer( 'labienveillance_jlm_douche', 'nonce' );

	$raw = isset( $_POST['config'] ) ? wp_unslash( $_POST['config'] ) : '';
	if ( ! is_string( $raw ) ) {
		wp_send_json_error( array( 'message' => 'invalid' ), 400 );
	}

	$raw = trim( $raw );
	if ( '' === $raw ) {
		wp_send_json_error( array( 'message' => 'empty' ), 400 );
	}

	$data = json_decode( $raw, true );
	if ( JSON_ERROR_NONE !== json_last_error() || ! is_array( $data ) ) {
		wp_send_json_error( array( 'message' => 'json' ), 400 );
	}

	update_option( LABIENVEILANCE_JLM_DOUCHE_OPTION, wp_json_encode( $data, JSON_UNESCAPED_UNICODE ), false );
	wp_send_json_success();
}

add_action( 'wp_ajax_jlm_load_douche_config', 'labienveillance_jlm_douche_ajax_load' );
add_action( 'wp_ajax_nopriv_jlm_load_douche_config', 'labienveillance_jlm_douche_ajax_load' );
add_action( 'wp_ajax_jlm_save_douche_config', 'labienveillance_jlm_douche_ajax_save' );

/**
 * Surcharges par défaut du configurateur douche pour WordPress (images thème,
 * prix alignés ancien outil, textes conseils « Conseils »).
 *
 * Filtre : labienveillance_jlm_douche_defaults.
 *
 * @return array<string, mixed>
 */
function labienveillance_jlm_douche_defaults(): array {
	$img = static function ( string $path ): array {
		return array( 'url' => labienveillance_img( $path ) );
	};

	$page_aides_url = labienveillance_page_url( 'aides-financieres' );

	$defaults = array(
		'companyLine' => 'La Bienveillance — Devis estimatif salle de bain',
		'contactUrl' => labienveillance_page_url( 'contact' ) . '#demander-rdv',
		'contactLabel' => __( 'Envoyer mon projet à La Bienveillance', 'labienveillance' ),
		'comments' => array(
			'avant_apres'     => __( 'Photos avant / après : exemples représentatifs.', 'labienveillance' ),
			'fenetre'        => __( 'Une fenêtre dans le prolongement de la paroi limite parfois les modèles disponibles — c’est pour cela que nous posons la question dès le début.', 'labienveillance' ),
			'implantation'   => __( 'En angle : douche calée dans deux murs perpendiculaires. En niche : douche placée entre deux murs déjà existants.', 'labienveillance' ),
			'taille_bac'     => __( 'Mesures conseillées : longueur 80–180 cm, largeur 70–100 cm. Le receveur extra-plat permet une entrée de plain-pied.', 'labienveillance' ),
			'modele'         => __( 'Plus la paroi est ouvrante (pivotante, coulissante), plus l’entrée est confortable. La paroi fixe est l’option la plus économique.', 'labienveillance' ),
			'verre'          => __( 'Le verre dépoli préserve l’intimité, recommandé si la salle de bain est partagée.', 'labienveillance' ),
			'robinetterie'   => __( 'Si la robinetterie reste à sa place actuelle, pas de surcoût. Sinon, nous prévoyons les travaux de plomberie nécessaires.', 'labienveillance' ),
			'forfaits'       => __( 'Ces forfaits couvrent la dépose / repose d’éléments existants. Cochez uniquement ce qui s’applique chez vous.', 'labienveillance' ),
			'garanties_douche' => __( 'Visite technique gratuite, devis sans engagement, garantie sur la fourniture ET la pose.', 'labienveillance' ),
			'aides_douche' => sprintf(
				/* translators: %s URL page aides */
				__( 'MaPrimeAdapt’, TVA réduite, aides ANAH… Retrouvez le détail sur %s.', 'labienveillance' ),
				$page_aides_url
			),
			'recap_douche'       => __( 'Récapitulatif de votre future douche sécurisée. Vous pouvez revenir en arrière à tout moment.', 'labienveillance' ),
			'price_douche'       => __( 'Estimation TTC posée. Le prix définitif est confirmé lors de la visite technique gratuite.', 'labienveillance' ),
			'proposition_sdb'    => __( 'Vous pouvez en rester là si vous le souhaitez : la suite est facultative et concerne le reste de la pièce.', 'labienveillance' ),
			'habillage_murs'    => __( 'Dalles SPC clipsables, étanches, garanties 10 ans. Couleurs et finitions vues lors de la visite technique.', 'labienveillance' ),
			'sol_antiderapant'  => __( 'Sols clipsables certifiés R10 AKW, étanches, garantis 15 ans.', 'labienveillance' ),
			'meubles'           => __( 'Modèle et couleur à préciser avec le conseiller lors de la visite technique.', 'labienveillance' ),
			'porte_coulissante' => __( 'Système silencieux sur rail, fourniture et pose incluses.', 'labienveillance' ),
			'seche_serviettes' => __( 'Électrique, mixte ou eau chaude — modèle choisi avec le conseiller.', 'labienveillance' ),
			'solutions_wc'      => __( 'Surélevé pour limiter l’effort, suspendu pour une finition contemporaine, broyeur silencieux quand l’évacuation est compliquée.', 'labienveillance' ),
			'recap_global'      => __( 'Vue d’ensemble. Vous pouvez encore revenir modifier n’importe quel choix.', 'labienveillance' ),
			'price_global'      => __( 'Détail des trois grands postes : douche, aménagements, WC.', 'labienveillance' ),
			'final_total'       => __( 'Vous pouvez nous transmettre cette estimation depuis le bouton ci-dessous — nous recevrons aussi votre récapitulatif et nous vous rappelons sous 24–48 h.', 'labienveillance' ),
		),
		'prices' => array(
			'wcSureleve'          => 590,
			'wcSuspenduHabillage' => 1490,
			'wcBroyeurSilencieux' => 990,
			'forfaitMachineLaver' => 290,
			'forfaitLavabo'       => 390,
			'forfaitBidet'       => 290,
		),
		'images' => array(
			'logo'                         => $img( 'logo-la-bienveillance.png' ),
			'avant_photo_1'                => $img( 'sdb/sdb-avant-1.jpg' ),
			'avant_photo_2'               => $img( 'sdb/sdb-avant-2.jpg' ),
			'apres_photo_1'                => $img( 'sdb/sdb-apres-1.jpg' ),
			'apres_photo_2'               => $img( 'sdb/sdb-apres-2.jpg' ),
			'apres_photo_3'                => $img( 'sdb/sdb-apres-2.jpg' ),
			'apres_photo_4'               => $img( 'sdb/sdb-apres-1.jpg' ),
			'fenetre_oui'                  => $img( 'douche-securisee.jpg' ),
			'fenetre_non'                 => $img( 'sdb/sdb-avant-1.jpg' ),
			'fenetre_paroi_fixe'          => $img( 'douche-securisee.jpg' ),
			'fenetre_paroi_fixe_volet'    => $img( 'douche-securisee.jpg' ),
			'implantation_angle'          => $img( 'douche-securisee.jpg' ),
			'implantation_niche'          => $img( 'sdb/sdb-avant-1.jpg' ),
			'modele_fixe'                 => $img( 'douche-securisee.jpg' ),
			'modele_fixe_volet'           => $img( 'douche-securisee.jpg' ),
			'modele_fixe_volet_angle'     => $img( 'douche-securisee.jpg' ),
			'modele_coulissante'          => $img( 'douche-securisee.jpg' ),
			'modele_coulissante_angle'    => $img( 'douche-securisee.jpg' ),
			'modele_pivotante'           => $img( 'douche-securisee.jpg' ),
			'modele_pivotante_angle'      => $img( 'douche-securisee.jpg' ),
			'modele_deux_pivotantes'      => $img( 'douche-securisee.jpg' ),
			'verre_transparent'          => $img( 'douche-securisee.jpg' ),
			'verre_depoli'               => $img( 'douche-securisee.jpg' ),
			'robinetterie_oui'           => $img( 'installateur-sdb.jpg' ),
			'robinetterie_non'          => $img( 'douche-securisee.jpg' ),
			'proposition_sdb_photo'      => $img( 'sdb/sdb-proposition-renovation.jpg' ),
			'habillage_murs_1'           => $img( 'sdb/sdb-habillage-1.jpg' ),
			'habillage_murs_2'          => $img( 'sdb/sdb-habillage-2.jpg' ),
			'sol_antiderapant_ex1'       => $img( 'sdb/sdb-sol-1.jpg' ),
			'sol_antiderapant_ex2'      => $img( 'sdb/sdb-sol-2.jpg' ),
			'meubles_ex1'                => $img( 'sdb/sdb-apres-1.jpg' ),
			'meubles_ex2'                => $img( 'sdb/sdb-habillage-1.jpg' ),
			'meubles_ex3'                => $img( 'sdb/sdb-apres-2.jpg' ),
			'meubles_ex4'               => $img( 'sdb/sdb-habillage-2.jpg' ),
			'porte_coulissante_photo'    => $img( 'sdb/sdb-porte-coulissante.jpg' ),
			'seche_serviettes_photo'    => $img( 'sdb/sdb-seche-serviettes.jpg' ),
			'wc_sureleve_photo'          => $img( 'sdb/sdb-apres-1.jpg' ),
			'wc_suspendu_habillage_photo' => $img( 'sdb/sdb-apres-2.jpg' ),
			'wc_broyeur_silencieux_photo' => $img( 'installateur-sdb.jpg' ),
			'garanties_photo_1'         => $img( 'devis-monte-escalier/garanties.jpg' ),
			'garanties_photo_2'         => $img( 'douche-securisee.jpg' ),
		),
	);

	return apply_filters( 'labienveillance_jlm_douche_defaults', $defaults );
}

/**
 * ID conteneur Google Tag Manager. Filtre : retourner une chaîne vide pour désactiver.
 */
function labienveillance_gtm_container_id(): string {
	$id = apply_filters( 'labienveillance_gtm_container_id', LABIENVEILANCE_GTM_ID );
	return is_string( $id ) ? trim( $id ) : '';
}

/**
 * Google Tag Manager — script dans le &lt;head&gt;.
 */
function labienveillance_gtm_head(): void {
	$id = labienveillance_gtm_container_id();
	if ( '' === $id ) {
		return;
	}
	?>
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','<?php echo esc_js( $id ); ?>');</script>
<!-- End Google Tag Manager -->
	<?php
}
add_action( 'wp_head', 'labienveillance_gtm_head', 1 );

/**
 * Google Tag Manager — iframe noscript juste après &lt;body&gt; (via wp_body_open).
 */
function labienveillance_gtm_noscript(): void {
	$id = labienveillance_gtm_container_id();
	if ( '' === $id ) {
		return;
	}
	$url = 'https://www.googletagmanager.com/ns.html?id=' . rawurlencode( $id );
	?>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="<?php echo esc_url( $url ); ?>"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
	<?php
}
add_action( 'wp_body_open', 'labienveillance_gtm_noscript', 1 );

/**
 * URL d’une image du dossier assets/img/
 * (?v=LABIENVEILANCE_VERSION évite CDN / navigateur servant d’anciens JPG après remplacement.)
 */
function labienveillance_img( string $filename ): string {
	$path = 'assets/img/' . ltrim( $filename, '/' );
	$url  = get_theme_file_uri( $path );
	return esc_url( add_query_arg( 'v', rawurlencode( LABIENVEILANCE_VERSION ), $url ) );
}

/**
 * Lien vers une page par slug (permaliens « %postname% »).
 */
function labienveillance_page_url( string $slug ): string {
	$slug = trim( $slug, '/' );
	if ( '' === $slug ) {
		return esc_url( home_url( '/' ) );
	}
	return esc_url( home_url( '/' . $slug . '/' ) );
}

/**
 * URL optionnelle pour une page « devis JLM seul » (sans header/footer), ex. ancien lien / embed.
 * 1) Filtre labienveillance_devis_iframe_url si renseigné.
 * 2) Sinon première page publiée au modèle « Embed — Devis JLM seul ».
 * 3) Sinon fichier statique à la racine /devis-embed.html (à déployer avec js/jlm-lite-devis.js).
 */
function labienveillance_get_devis_embed_url(): string {
	$custom = apply_filters( 'labienveillance_devis_iframe_url', null );
	if ( is_string( $custom ) && '' !== trim( $custom ) ) {
		return esc_url( $custom );
	}

	$q = new WP_Query(
		array(
			'post_type'              => 'page',
			'posts_per_page'         => 1,
			'post_status'            => 'publish',
			'no_found_rows'          => true,
			'ignore_sticky_posts'    => true,
			'update_post_meta_cache' => false,
			'update_post_term_cache' => false,
			'meta_key'               => '_wp_page_template',
			'meta_value'             => 'page-embed-devis-jlm.php',
			'fields'                 => 'ids',
		)
	);

	if ( $q->have_posts() ) {
		return esc_url( get_permalink( (int) $q->posts[0] ) );
	}

	return esc_url( home_url( '/devis-embed.html' ) );
}

/**
 * Thème clair / sombre : script dans le <head> pour éviter un flash de fond clair.
 */
function labienveillance_theme_init_script(): void {
	$dir  = get_template_directory();
	$uri  = get_template_directory_uri();
	$path = $dir . '/assets/js/theme-init.js';
	if ( ! is_readable( $path ) ) {
		return;
	}
	wp_enqueue_script(
		'labienveillance-theme-init',
		$uri . '/assets/js/theme-init.js',
		array(),
		(string) filemtime( $path ),
		false
	);
}
add_action( 'wp_enqueue_scripts', 'labienveillance_theme_init_script', 3 );

/**
 * Enqueue styles & scripts (identique à la maquette statique).
 */
function labienveillance_assets(): void {
	$theme_uri = get_template_directory_uri();
	$dir       = get_template_directory();

	wp_enqueue_style(
		'labienveillance-fonts',
		'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap',
		array(),
		null
	);

	$css_path = $dir . '/assets/css/style.css';
	wp_enqueue_style(
		'labienveillance-main',
		$theme_uri . '/assets/css/style.css',
		array( 'labienveillance-fonts' ),
		file_exists( $css_path ) ? (string) filemtime( $css_path ) : LABIENVEILANCE_VERSION
	);

	$devis_choice_path = $dir . '/assets/js/devis-choice.js';
	if ( is_readable( $devis_choice_path ) ) {
		wp_enqueue_script(
			'labienveillance-devis-choice',
			$theme_uri . '/assets/js/devis-choice.js',
			array(),
			(string) filemtime( $devis_choice_path ),
			true
		);
		wp_localize_script(
			'labienveillance-devis-choice',
			'labienveillanceDevisChoice',
			array(
				'monteUrl' => esc_url_raw( labienveillance_page_url( 'estimation-monte-escalier' ) ),
				'sdbUrl'   => esc_url_raw( labienveillance_page_url( 'estimation-douche' ) ),
			)
		);
	}

	wp_enqueue_script(
		'labienveillance-main',
		$theme_uri . '/assets/js/main.js',
		is_readable( $devis_choice_path ) ? array( 'labienveillance-devis-choice' ) : array(),
		file_exists( $dir . '/assets/js/main.js' ) ? (string) filemtime( $dir . '/assets/js/main.js' ) : LABIENVEILANCE_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'labienveillance_assets' );

/**
 * Menus WP : le HTML utilise <nav class="nav"><a>…</a></nav> ; WordPress sort des <ul><li>.
 */
function labienveillance_nav_wp_compat_css(): void {
	$css = '
		.nav > ul { display: flex; flex-wrap: wrap; align-items: center; gap: 0.05rem; list-style: none; margin: 0; padding: 0; }
		.nav li { margin: 0; padding: 0; list-style: none; }
	';
	wp_add_inline_style( 'labienveillance-main', $css );
}
add_action( 'wp_enqueue_scripts', 'labienveillance_nav_wp_compat_css', 25 );

/**
 * Pages sur lesquelles charger l’outil devis JLM (admin-ajax jlm_get_config / jlm_save_config côté site).
 */
function labienveillance_should_load_jlm_devis(): bool {
	if ( ! is_singular( 'page' ) ) {
		return false;
	}
	if (
		is_page_template( 'page-devis-monte-escalier.php' )
		|| is_page_template( 'page-estimation-monte-escalier.php' )
	) {
		return true;
	}
	if ( is_page( 'estimation-monte-escalier' ) ) {
		return true;
	}
	$slugs = array(
		'devis-estimatif',
		'devis-estimatif-monte-escalier',
		'elementor-1985',
	);
	return is_page( $slugs );
}

/**
 * URLs absolues des illustrations du devis monte-escalier.
 *
 * Toutes les photos sont servies par le thème dans
 * `assets/img/devis-monte-escalier/`. Le filtre `labienveillance_jlm_images`
 * permet de surcharger n'importe quelle clé pour pointer vers la médiathèque
 * WP (utile quand le client envoie des photos de chantiers réels).
 *
 * @return array<string,string> Map clé JS -> URL absolue.
 */
function labienveillance_jlm_image_urls(): array {
	$uri = get_template_directory_uri() . '/assets/img/devis-monte-escalier/';
	$map = array(
		'logo'             => 'logo-jlm.png',
		'type_droit'       => 'escalier-droit.jpg',
		'type_90'          => 'escalier-90.jpg',
		'type_180'         => 'escalier-180.jpg',
		'type_ext'         => 'escalier-exterieur.jpg',
		'marque_up'        => 'marque-up-stairlift.jpg',
		'marque_acorn'     => 'marque-acorn.png',
		'depart_std'       => 'depart-standard.jpg',
		'depart_rall'      => 'depart-rallonge.jpg',
		'depart_p90'       => 'depart-pivot-90.jpg',
		'depart_p180'      => 'depart-pivot-180.jpg',
		'obstacle_ex1'     => 'obstacle-exemple-1.jpg',
		'obstacle_ex2'     => 'obstacle-exemple-2.jpg',
		'obstacle_yes'     => 'obstacle-oui.jpg',
		'obstacle_no'      => 'obstacle-non.jpg',
		'rail_1'           => 'rail-exemple-1.jpg',
		'rail_2'           => 'rail-exemple-2.jpg',
		'rail_yes'         => 'rail-oui.jpg',
		'rail_no'          => 'rail-non.jpg',
		'arr_nez'          => 'arrivee-nez-marche.jpg',
		'arr_prol'         => 'arrivee-prolongement.jpg',
		'arr_90'           => 'arrivee-90.jpg',
		'arr_180'          => 'arrivee-180.jpg',
		'pivot_manuel'     => 'pivot-manuel.jpg',
		'pivot_elec'       => 'pivot-electrique.jpg',
		'garanties_photo'  => 'garanties.jpg',
		'aides_photo'      => 'aides.jpg',
	);
	$urls = array();
	foreach ( $map as $key => $filename ) {
		$urls[ $key ] = $uri . $filename;
	}
	$filtered = apply_filters( 'labienveillance_jlm_images', $urls );
	return is_array( $filtered ) ? $filtered : $urls;
}

/**
 * Script devis estimatif (extrait de la page Elementor actuelle).
 */
function labienveillance_enqueue_jlm_devis(): void {
	if ( ! labienveillance_should_load_jlm_devis() ) {
		return;
	}
	$dir  = get_template_directory();
	$uri  = get_template_directory_uri();
	wp_enqueue_style(
		'labienveillance-jlm-fonts',
		'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@400;600;700&display=swap',
		array(),
		null
	);

	$css_path = $dir . '/assets/css/jlm-lite-devis.css';
	if ( is_readable( $css_path ) ) {
		wp_enqueue_style(
			'labienveillance-jlm-devis',
			$uri . '/assets/css/jlm-lite-devis.css',
			array( 'labienveillance-jlm-fonts' ),
			(string) filemtime( $css_path )
		);
	}

	$path = $dir . '/assets/js/jlm-lite-devis.js';
	if ( ! is_readable( $path ) ) {
		return;
	}
	wp_enqueue_script(
		'labienveillance-jlm-devis',
		$uri . '/assets/js/jlm-lite-devis.js',
		array(),
		(string) filemtime( $path ),
		true
	);
	wp_localize_script(
		'labienveillance-jlm-devis',
		'labienveillanceJlm',
		array(
			'ajaxUrl'      => admin_url( 'admin-ajax.php' ),
			'contactUrl'   => home_url( '/contact/' ),
			'contactLabel' => __( 'CONTACTEZ-NOUS', 'labienveillance' ),
			'images'       => labienveillance_jlm_image_urls(),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'labienveillance_enqueue_jlm_devis', 35 );

/**
 * Devis estimatif salle de bain — vrai/faux pour conditionner l'enqueue.
 * Ne charge le configurateur que sur la page dédiée « estimation-douche » (slug ou modèle).
 */
function labienveillance_should_load_devis_sdb(): bool {
	if ( ! is_singular( 'page' ) ) {
		return false;
	}
	if ( is_page_template( 'page-estimation-douche.php' ) ) {
		return true;
	}
	return is_page( 'estimation-douche' );
}

/**
 * Devis estimatif salle de bain — configurateur douche « JLM » (intégré).
 *
 * - Compléments section (noscript, etc.) : assets/css/devis-sdb.css
 * - Styles et script outil + persistance AJAX : jlm-douche-app.css / .js
 * - Valeurs PHP par défaut : labienveillance_jlm_douche_defaults (filtre).
 *
 * Ancien fichier devis-sdb.js : conservé pour maquettes statiques hors WordPress.
 */
function labienveillance_enqueue_devis_sdb(): void {
	if ( ! labienveillance_should_load_devis_sdb() ) {
		return;
	}

	$dir = get_template_directory();
	$uri = get_template_directory_uri();

	$strip_css = $dir . '/assets/css/devis-sdb.css';
	if ( is_readable( $strip_css ) ) {
		wp_enqueue_style(
			'labienveillance-devis-sdb-strip',
			$uri . '/assets/css/devis-sdb.css',
			array( 'labienveillance-main' ),
			(string) filemtime( $strip_css )
		);
	}

	$jlm_css = $dir . '/assets/css/jlm-douche-app.css';
	if ( is_readable( $jlm_css ) ) {
		$deps = array( 'labienveillance-main' );
		if ( wp_style_is( 'labienveillance-devis-sdb-strip', 'enqueued' ) ) {
			$deps[] = 'labienveillance-devis-sdb-strip';
		}
		// filemtime + version thème : évite CDN / minification qui gardent un vieux jlm-douche-app.* après déploiement.
		$jlm_css_ver = (string) filemtime( $jlm_css ) . '-' . LABIENVEILANCE_VERSION;
		wp_enqueue_style(
			'labienveillance-jlm-douche-app',
			$uri . '/assets/css/jlm-douche-app.css',
			$deps,
			$jlm_css_ver
		);
	}

	$js_path = $dir . '/assets/js/jlm-douche-app.js';
	if ( ! is_readable( $js_path ) ) {
		return;
	}

	$jlm_js_ver = (string) filemtime( $js_path ) . '-' . LABIENVEILANCE_VERSION;
	wp_enqueue_script(
		'labienveillance-jlm-douche-app',
		$uri . '/assets/js/jlm-douche-app.js',
		array(),
		$jlm_js_ver,
		true
	);

	wp_localize_script(
		'labienveillance-jlm-douche-app',
		'JLM_DOUCHE_WP',
		array(
			'ajaxUrl'                => admin_url( 'admin-ajax.php' ),
			'nonce'                  => wp_create_nonce( 'labienveillance_jlm_douche' ),
			'canManage'              => current_user_can( 'manage_options' ),
			'contactHref'            => labienveillance_page_url( 'contact' ),
			'contactHash'            => 'demander-rdv',
			'backOfficeFallbackCode' => apply_filters( 'labienveillance_jlm_douche_bo_fallback_code', '' ),
			'defaults'               => labienveillance_jlm_douche_defaults(),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'labienveillance_enqueue_devis_sdb', 40 );

/**
 * Pré-remplissage du formulaire de contact depuis les querystrings du
 * configurateur (`?projet=devis-sdb&total=…&recap=…`).
 *
 * Chargé uniquement sur la page « contact ». Marche pour le formulaire CF7
 * comme pour le formulaire HTML statique de secours, en se calant sur les
 * `name="sujet"` et `name="message"` partagés.
 */
function labienveillance_enqueue_contact_prefill(): void {
	if ( ! is_singular( 'page' ) ) {
		return;
	}
	if ( ! is_page( 'contact' ) && ! is_page_template( 'page-contact.php' ) ) {
		return;
	}

	$dir  = get_template_directory();
	$uri  = get_template_directory_uri();
	$path = $dir . '/assets/js/contact-prefill.js';
	if ( ! is_readable( $path ) ) {
		return;
	}

	wp_enqueue_script(
		'labienveillance-contact-prefill',
		$uri . '/assets/js/contact-prefill.js',
		array(),
		(string) filemtime( $path ),
		true
	);
}
add_action( 'wp_enqueue_scripts', 'labienveillance_enqueue_contact_prefill', 42 );

/**
 * Prise en charge du thème.
 */
function labienveillance_setup(): void {
	load_theme_textdomain( 'labienveillance', get_template_directory() . '/languages' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' )
	);
	add_theme_support( 'custom-logo', array( 'height' => 80, 'width' => 240, 'flex-height' => true, 'flex-width' => true ) );

	register_nav_menus(
		array(
			'primary' => __( 'Menu principal', 'labienveillance' ),
		)
	);
}
add_action( 'after_setup_theme', 'labienveillance_setup' );

/**
 * Conserver l’alignement header si logo personnalisé.
 */
function labienveillance_custom_logo_link_class( string $html ): string {
	return str_replace( 'class="custom-logo-link"', 'class="custom-logo-link header__logo"', $html );
}
add_filter( 'get_custom_logo', 'labienveillance_custom_logo_link_class' );

/**
 * Pages secondaires à exclure des moteurs (noindex, follow).
 *
 * `mentions-legales` : page publiée au go-live, doit rester hors index.
 * `parrainage` : page non créée par défaut (programme reporté), conservée
 * dans la liste de manière défensive — au cas où le client la publierait
 * un jour avant que le contenu ne soit finalisé.
 *
 * Si Yoast SEO est actif, **Yoast prime** et écrase ces directives via la métabox
 * « Avancé » de la page (Autoriser les moteurs… → Non). Configurer côté Yoast pour la prod.
 */
function labienveillance_robots_noindex( array $robots ): array {
	if ( is_page( array( 'mentions-legales', 'parrainage' ) ) ) {
		$robots['noindex']  = true;
		$robots['follow']   = true;
		$robots['noarchive'] = true;
		unset( $robots['index'], $robots['archive'] );
	}
	return $robots;
}
add_filter( 'wp_robots', 'labienveillance_robots_noindex' );

/**
 * Menu par défaut si aucun menu n’est assigné à « primary ».
 */
function labienveillance_nav_fallback(): void {
	echo '<nav class="nav" aria-label="' . esc_attr__( 'Navigation principale', 'labienveillance' ) . '">';
	echo '<ul class="nav__list" role="menubar">';

	$home_url = labienveillance_page_url( '' );
	$home_act = is_front_page() ? ' class="active"' : '';
	printf(
		'<li role="none"><a href="%s" role="menuitem"%s>%s</a></li>',
		esc_url( $home_url ),
		$home_act, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		esc_html( __( 'Accueil', 'labienveillance' ) )
	);

	$services_active = is_page(
		array(
			'monte-escaliers',
			'salle-de-bain',
			'amenagements',
			'estimation-monte-escalier',
			'estimation-douche',
		)
	);
	$trail_class     = $services_active ? 'menu-item-has-children active-trail' : 'menu-item-has-children';
	printf( '<li class="%s" role="none">', esc_attr( $trail_class ) );
	echo '<button type="button" class="nav__dropdown-toggle" aria-expanded="false" aria-haspopup="true" aria-controls="nav-submenu-services" id="nav-btn-services">';
	echo esc_html__( 'Nos services', 'labienveillance' );
	echo '</button>';
	echo '<ul class="sub-menu" id="nav-submenu-services" role="menu">';
	$services = array(
		array( 'monte-escaliers', __( 'Monte-escaliers', 'labienveillance' ) ),
		array( 'salle-de-bain', __( 'Salle de bain', 'labienveillance' ) ),
		array( 'amenagements', __( 'Aménagements', 'labienveillance' ) ),
	);
	foreach ( $services as $row ) {
		$u   = labienveillance_page_url( $row[0] );
		$act = is_page( $row[0] ) ? ' class="active"' : '';
		printf(
			'<li role="none"><a href="%s" role="menuitem"%s>%s</a></li>',
			esc_url( $u ),
			$act, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			esc_html( $row[1] )
		);
	}
	echo '</ul></li>';

	printf(
		'<li role="none"><a href="#devis-estimatif" role="menuitem" data-devis-modal aria-haspopup="dialog" class="nav__link--cta-devis">%1$s</a></li>',
		esc_html( __( 'Devis estimatif', 'labienveillance' ) )
	);

	$rest = array(
		array( 'conseils', __( 'Conseils & Santé', 'labienveillance' ) ),
		array( 'aides-financieres', __( 'Aides', 'labienveillance' ) ),
		array( 'contact', __( 'Contact', 'labienveillance' ) ),
	);
	foreach ( $rest as $item ) {
		$url    = labienveillance_page_url( $item[0] );
		$active = is_page( $item[0] ) ? ' class="active"' : '';
		printf(
			'<li role="none"><a href="%s" role="menuitem"%s>%s</a></li>',
			esc_url( $url ),
			$active, // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			esc_html( $item[1] )
		);
	}

	echo '</ul></nav>';
}
