"""17 - Forcer l'install des tables Redirection via un mu-plugin one-shot."""
from __future__ import annotations

import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _env import sftp_connect, wp_get

PHP_CODE = r"""<?php
/**
 * Plugin Name: LBV Redirection Schema Install (one-shot)
 * Description: Cree directement les tables SQL du plugin Redirection (5.x).
 * A supprimer apres la mise en ligne.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'init', function () {
    if ( get_option( 'lbv_redirection_install_done' ) ) {
        return;
    }
    global $wpdb;
    $pfx = $wpdb->prefix;
    $cs  = $wpdb->get_charset_collate();

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';

    $tables = array();

    $tables[] = "CREATE TABLE {$pfx}redirection_items (
        id bigint(20) unsigned NOT NULL auto_increment,
        url varchar(2000) NOT NULL,
        match_url varchar(2000) DEFAULT NULL,
        match_data text,
        regex int(11) NOT NULL DEFAULT '0',
        position int(11) unsigned NOT NULL DEFAULT '0',
        last_count int(10) unsigned NOT NULL DEFAULT '0',
        last_access datetime NOT NULL DEFAULT '1970-01-01 00:00:00',
        group_id int(11) NOT NULL DEFAULT '0',
        status enum('enabled','disabled') NOT NULL DEFAULT 'enabled',
        action_type varchar(20) NOT NULL DEFAULT '',
        action_code int(11) unsigned NOT NULL DEFAULT '0',
        action_data text,
        match_type varchar(20) NOT NULL DEFAULT '',
        title varchar(50) DEFAULT NULL,
        PRIMARY KEY (id),
        KEY status (status),
        KEY url_index (url(191)),
        KEY group_idx (group_id)
    ) {$cs};";

    $tables[] = "CREATE TABLE {$pfx}redirection_groups (
        id int(11) unsigned NOT NULL auto_increment,
        name varchar(50) NOT NULL DEFAULT '',
        tracking int(11) NOT NULL DEFAULT '1',
        module_id int(11) unsigned NOT NULL DEFAULT '0',
        status enum('enabled','disabled') NOT NULL DEFAULT 'enabled',
        position int(11) unsigned NOT NULL DEFAULT '0',
        PRIMARY KEY (id),
        KEY module_idx (module_id)
    ) {$cs};";

    $tables[] = "CREATE TABLE {$pfx}redirection_logs (
        id bigint(20) unsigned NOT NULL auto_increment,
        created datetime NOT NULL DEFAULT '1970-01-01 00:00:00',
        created_time int(11) unsigned NOT NULL DEFAULT '0',
        url text NOT NULL,
        domain varchar(255) DEFAULT NULL,
        sent_to text,
        request_method varchar(10) DEFAULT NULL,
        http_code int(11) unsigned NOT NULL DEFAULT '0',
        request_data longtext,
        agent varchar(255) DEFAULT NULL,
        referrer varchar(255) DEFAULT NULL,
        ip varchar(45) DEFAULT NULL,
        redirection_id bigint(20) unsigned DEFAULT NULL,
        redirect_by varchar(50) DEFAULT NULL,
        PRIMARY KEY (id),
        KEY url_idx (url(191)),
        KEY created_idx (created),
        KEY red_id (redirection_id),
        KEY ip_idx (ip)
    ) {$cs};";

    $tables[] = "CREATE TABLE {$pfx}redirection_404 (
        id bigint(20) unsigned NOT NULL auto_increment,
        created datetime NOT NULL DEFAULT '1970-01-01 00:00:00',
        created_time int(11) unsigned NOT NULL DEFAULT '0',
        url text NOT NULL,
        domain varchar(255) DEFAULT NULL,
        request_method varchar(10) DEFAULT NULL,
        http_code int(11) unsigned NOT NULL DEFAULT '0',
        request_data longtext,
        agent varchar(255) DEFAULT NULL,
        referrer varchar(255) DEFAULT NULL,
        ip varchar(45) DEFAULT NULL,
        PRIMARY KEY (id),
        KEY url_idx (url(191)),
        KEY created_idx (created),
        KEY ip_idx (ip)
    ) {$cs};";

    foreach ( $tables as $sql ) {
        dbDelta( $sql );
    }

    // Verifier
    $exists = $wpdb->get_var( "SHOW TABLES LIKE '{$pfx}redirection_items'" );
    if ( ! $exists ) {
        error_log( 'LBV: redirection_items absent apres dbDelta' );
        return;
    }

    // Marquer comme installe pour le plugin Redirection
    $opts = get_option( 'redirection_options', array() );
    if ( ! is_array( $opts ) ) $opts = array();
    $opts['database'] = '4.2';
    update_option( 'redirection_options', $opts );

    // Creer un groupe par defaut si aucun
    $count = (int) $wpdb->get_var( "SELECT COUNT(*) FROM {$pfx}redirection_groups" );
    if ( $count === 0 ) {
        $wpdb->insert(
            $pfx . 'redirection_groups',
            array(
                'name'      => 'Redirections',
                'tracking'  => 1,
                'module_id' => 1,
                'status'    => 'enabled',
                'position'  => 0,
            )
        );
    }

    update_option( 'lbv_redirection_install_done', current_time( 'mysql' ) );
}, 99 );
"""

REMOTE = "clickandbuilds/laseptieme/wp-content/mu-plugins/lbv-redirection-install.php"


def main() -> None:
    print("== Deploiement du mu-plugin one-shot ==")
    t, s = sftp_connect()
    try:
        with s.open(REMOTE, "w") as f:
            f.write(PHP_CODE.encode("utf-8"))
        st = s.stat(REMOTE)
        print(f"  Upload OK : {REMOTE} ({st.st_size} bytes)")
    finally:
        s.close()
        t.close()

    print("\n== Trigger requete pour declencher init ==")
    for i in range(3):
        wp_get("/", params={})
        wp_get("/redirection/v1/plugin")
        time.sleep(1)
        print(f"  trigger #{i+1}")

    time.sleep(2)

    print("\n== Status apres install ==")
    st, body = wp_get("/redirection/v1/plugin")
    for sline in body.get("status", []):
        print(" ", sline.get("status"), "|", sline.get("id"), "|", sline.get("message")[:80])

    print("\n== Test creation groupe ==")
    from _env import wp_post
    st, body = wp_post("/redirection/v1/group", body={"name": "LBV test post-install", "moduleId": 1})
    print(f"  HTTP {st}")
    if isinstance(body, dict):
        if "items" in body:
            print(f"  Total groupes : {len(body['items'])}")
            for g in body["items"]:
                print(f"    #{g.get('id')} {g.get('name')}")
        else:
            import json
            print(json.dumps(body, ensure_ascii=False)[:400])


if __name__ == "__main__":
    main()
