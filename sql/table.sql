Create Table playball.Game(
	`GameID` int  AUTO_INCREMENT NOT NULL Comment 'GameID',
	`Type` int NOT NULL default 1 comment '比赛类型，NBA=1',
	`HostID` int NULL comment '主队ID',
	`HostName` varchar(50) NULL comment '主队名称',
	`VisitID` int NULL comment '客队ID',
	`VisitName` varchar(50) NULL comment '客队名称',
	`Time` DateTime NULL comment '比赛时间',
	`Status` int NOT NULL default 0 comment '比赛状态, 0=未开始,1=进行中，2=已结束',
	`Result` varchar(100) NULL comment '比赛结果，比分或者描述',
	`WinnerID` int NULL comment '胜利一方的ID',
	`Memo` text NULL comment '比赛描述',
	Primary KEY (`GameID`),
	index IX_TYPE_TIME(`Type`,`Time`)

)engine=innodb default charset=utf8 comment '比赛记录表';

Create Table playball.Live(
  `LiveID` int  AUTO_INCREMENT NOT NULL Comment 'LiveID',
  `GameID` int NOT NULL comment '比赛ID，Game.GameID',
  `Link` varchar(500) NOT NULL comment '链接',
  `Name` varchar(100) NOT NULL comment '链接名称',
  `Type` int NOT NULL default 1 comment '直播类型，1=视频，2=文字',
  Primary KEY (`LiveID`),
  index IX_GameID(`GameID`)
)engine=innodb default charset=utf8 comment '直播源';