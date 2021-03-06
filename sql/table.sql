Create Table playball.Game(
	`GameID` int  AUTO_INCREMENT NOT NULL Comment 'GameID',
	`Type` int NOT NULL default 1 comment '比赛类型，NBA=1',
	`HostID` int NULL comment '主队ID',
	`HostScore` int NULL comment '主队得分',
	`HostName` varchar(50) NULL comment '主队名称',
	`VisitID` int NULL comment '客队ID',
	`VisitScore` int NULL comment '客队得分',
	`VisitName` varchar(50) NULL comment '客队名称',
	`Time` DateTime NULL comment '比赛时间',
	`Status` int NOT NULL default 0 comment '比赛状态, 0=未开始,1=进行中，2=已结束',
	`Result` varchar(100) NULL comment '比赛结果，比分或者描述',
	`WinnerID` int NULL comment '胜利一方的ID',
	`Memo` text NULL comment '比赛描述',
	`ThirdID` int NULL comment 'hupu id',
  `IsPlayOff` int NOT NULL default 0 comment '如果是NBA，标记是否是季后赛，0=不是，1=是',
  `RoundID` int NOT NULL default 0 comment '如果是NBA季后赛，对应PlayOff表的RoundID',
  `Season` int NOT NULL  default 20142015 comment '赛季',
	Primary KEY (`GameID`),
	index IX_TYPE_TIME(`Type`,`Time`)

)engine=innodb default charset=utf8 comment '比赛记录表';

Create Table playball.Live(
  `LiveID` int  AUTO_INCREMENT NOT NULL Comment 'LiveID',
  `GameID` int NOT NULL comment '比赛ID，Game.GameID',
  `Link` varchar(200) NOT NULL comment '链接',
  `Name` varchar(100) NOT NULL comment '链接名称',
  `Type` int NOT NULL default 1 comment '直播类型，1=视频，2=文字',
  Primary KEY (`LiveID`),
  index IX_GameID(`GameID`),
  UNIQUE  KEY UK_GameID_Link(`GameID`,`Link`)
)engine=innodb default charset=utf8 comment '直播源';

Create Table playball.PlayOff(
  `RoundID` int  AUTO_INCREMENT NOT NULL Comment 'LiveID',
  `HostID` int NOT NULL COMMENT '主场优势球队ID',
  `HostName` varchar(100) NOT NULL COMMENT '主场优势球队名称',
  `HostRank` int NOT NULL COMMENT '主场优势球队排名',
  `HostWin` int NOT NULL default 0 COMMENT '主场优势球队赢的场数',
  `VisitID` int NOT NULL COMMENT '劣势球队ID',
  `VisitName` varchar(100) NOT NULL COMMENT '劣势球队名称',
  `VisitRank` int NOT NULL COMMENT '劣势球队排名',
  `VisitWin` int NOT NULL default 0 COMMENT '劣势球队赢的场数',
  `Round` int NOT NULL default 1 COMMENT '第几轮',
  `Area` int NOT NULL  default 1 COMMENT '东西部，1=西部，2=东部',
  `Season` int NOT NULL default 20142015 COMMENT '赛季',
  `Status` int NOT NULL default 1 COMMENT '1没打完，2打完',
  Primary KEY (`RoundID`),
  index IX_Round_Season(`Round`,`Season`)
)engine=innodb default charset=utf8 comment '季后赛对战表';

Create Table playball.Replay(
  `ReplayID` int  AUTO_INCREMENT NOT NULL Comment 'ReplayID',
  `GameID` int NOT NULL COMMENT 'GameID',
  `Title` varchar(200) NOT NULL COMMENT '比赛Title',
  `Link` varchar(200) NOT NULL COMMENT '链接',
  `Type` int NOT NULL DEFAULT 1 COMMENT '1 在线，2 下载',
  Primary KEY (`ReplayID`),
  index IX_GameID_Type(`GameID`,`Type`),
  UNIQUE  KEY UK_GameID_Link(`GameID`,`Link`)
)engine=innodb default charset=utf8 comment '录像表';

Create Table playball.Statistic(
  `ID` int  AUTO_INCREMENT NOT NULL Comment 'ID',
  `GameID` int NOT NULL COMMENT 'GameID',
  `Statistic` text NULL COMMENT '统计json',
  `UpdateTime` timestamp NOT NULL default NOW() COMMENT '更新时间',
  Primary KEY (`ID`),
  UNIQUE  KEY UK_GameID(`GameID`)
)engine=innodb default charset=utf8 comment '技术统计表';

Create Table playball.TextLive(
  `ID` int  AUTO_INCREMENT NOT NULL Comment 'ID',
  `GameID` int NOT NULL COMMENT 'GameID',
  `Time` varchar(20) NULL COMMENT '比赛当前时间',
  `Score` varchar(30) NULL COMMENT '比分',
  `Content` varchar(300) NULL  COMMENT '直播内容',
  `Channel` int NOT NULL  COMMENT '渠道,1 hupu , 2 sina',
  `UpdateTime` timestamp NOT NULL default NOW() COMMENT '更新时间',
  Primary KEY (`ID`),
  INDEX  IX_GameID_Channel(`GameID`,`Channel`)
)engine=innodb default charset=utf8 comment '文字直播';