export declare const SHORT_DASHBOARD_FRAGMENT = "\n  id\n  user {\n    id\n    username\n    email\n    avatarUrl\n  }\n  commentsCount\n  votedAt\n  votes { \n    userVotes:currentUserVotes\n    totalVoters\n    totalVotes\n  }\n";
export declare const PANEL_FRAGMENT = "\n  id\n  name\n  description\n  settings\n  sql {\n    query\n    parameters\n  }\n";
export declare const DASHBOARD_FRAGMENT: string;
