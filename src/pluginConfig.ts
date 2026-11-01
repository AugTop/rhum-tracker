import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-rhum-tracker',
    version: '1.0.0',
    icon: '⛵',
    title: 'Route du Rhum 2026 · Tracker',
    description:
        'Suivi en direct de la Route du Rhum 2026 : flotte complète, historique des traces, replay, classement par classe et fiche bateau.',
    author: 'Augustin',
    repository: 'https://github.com/<user>/windy-plugin-rhum-tracker',
    desktopUI: 'rhpane',
    mobileUI: 'fullscreen',
    routerPath: '/rhum-tracker',
    private: true,
};

export default config;
