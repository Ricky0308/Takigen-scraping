# Takigen scraping project
説明 : マイナビなどの就活サイトにおいて、会社検索をした際、特定の会社の表示順位をデータ化します。
業種や地域、選考の特徴など、条件を変えた際に表示がどのように変わるかを試すことができます
(タキゲン製造(株)の調査のために作成したサービスですが、どなたでも使うことができます)。

テストユーザー
Name : testuser
Password : securepass

Description : This service scrapes recruitment websites like MyNavi and gather data 
about how high the target companies are displayed among search results.
Users can gather data on multiple different condition sets (e.g. industry, localtion, selectino features, and etc). 
Although the service is made only for a company named Takigen, anyone can use it for searching their companies and competitors. 

For testing 
Name : testuser
Password : securepass

# How to use?
1 条件クラスターを作成する : 
画面左上のCluster選択の欄で「未選択」を選ぶと、条件クラスター作成モードに入れます。
画面下でクラスターの作成が可能となります。一つの条件がデータの一行となります。
データは、当該の条件において、ターゲット企業が何位に表示されるかについてのデータです。

2 データを収集する : 
クラスターの作成後、「以下の条件でデータを集める」を押下すると、データの収集が始まる。

-

1 Create condition cluster : 
Choose「未選択」on the select input at the left top position 
and you can create conditions. Each condition corresponds to each row of the result data. 
Result data indicates the position and percentile of the target company among the search result. 

2 Gather data: 
You can start scraping and gather data by clicking 「以下の条件でデータを集める」button. 

# What's going on inside?
データ収集は時間がかかるので、別のサーバーを用いて非同期処理を行なっております。
非同期処理にはceleryを使っております。

As it takes a long time to gather data, the backend sends tasks to other server asynchronously. 
The service uses celery for it. 

# Structure diagram 
This is the aws structure diagram of the service. 

![alt text](https://github.com/[Ricky0308]/[Takigen-scraping
]/blob/[main]/aws_arch.png?raw=true)