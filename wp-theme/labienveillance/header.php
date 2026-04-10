<?php
/**
 * En-tête
 *
 * @package Labienveillance
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="icon" href="<?php echo esc_url( get_theme_file_uri( 'assets/img/favicon.svg' ) ); ?>" type="image/svg+xml">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a href="#main" class="skip-link"><?php esc_html_e( 'Aller au contenu principal', 'labienveillance' ); ?></a>

<header class="header">
	<div class="header__main">
		<div class="container header__main-inner">
			<?php if ( has_custom_logo() ) : ?>
				<?php the_custom_logo(); ?>
			<?php else : ?>
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="header__logo">
					<img src="<?php echo esc_url( get_theme_file_uri( 'assets/img/logo-labienveillance.svg' ) ); ?>" alt="" class="header__logo-img" width="40" height="40" decoding="async">
					<?php esc_html_e( 'La ', 'labienveillance' ); ?><span><?php esc_html_e( 'Bienveillance', 'labienveillance' ); ?></span>
				</a>
			<?php endif; ?>
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'menu_class'     => 'nav__list',
					'menu_id'        => 'primary-menu',
					'fallback_cb'    => 'labienveillance_nav_fallback',
					'items_wrap'     => '<nav class="nav" role="navigation" aria-label="' . esc_attr__( 'Navigation principale', 'labienveillance' ) . '"><ul id="%1$s" class="%2$s">%3$s</ul></nav>',
				)
			);
			?>
			<button type="button" class="theme-toggle" aria-pressed="true" aria-label="<?php esc_attr_e( 'Activer le thème clair', 'labienveillance' ); ?>" title="<?php esc_attr_e( 'Thème clair ou sombre', 'labienveillance' ); ?>" data-theme-toggle>
				<svg class="theme-toggle__icon theme-toggle__icon--moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
				<svg class="theme-toggle__icon theme-toggle__icon--sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
			</button>
			<a href="<?php echo esc_url( labienveillance_page_url( 'contact' ) ); ?>" class="btn btn--accent btn--sm header__cta"><?php esc_html_e( 'Devis gratuit', 'labienveillance' ); ?></a>
			<button type="button" class="menu-toggle" aria-label="<?php esc_attr_e( 'Ouvrir le menu', 'labienveillance' ); ?>" aria-expanded="false">
				<span></span>
			</button>
		</div>
	</div>
</header>
