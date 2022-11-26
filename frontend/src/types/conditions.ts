export type Condition = {
    検索語?: string,
    業種_カテゴリ?: string,
    業種_詳細?: string,
    地域?: string,
    職種?: string,
    福利厚生?: string,
    従業員数?: string,
    選考の特徴?: string,
    募集の特徴?: string,
    募集対象?: string,
    募集人数?: string,
    受付状況?: string,
};

export type CondCluster = Condition[];

export const expCondCluster:CondCluster = [
    {検索語:"製造,メーカー"}
]