const raw_names = `
1	James	4,625,363	Mary	3,054,624
2	Robert	4,357,620	Patricia	1,551,159
3	John	4,354,502	Jennifer	1,469,664
4	Michael	4,345,849	Linda	1,448,284
5	David	3,564,272	Elizabeth	1,403,790
6	William	3,484,904	Barbara	1,385,994
7	Richard	2,423,956	Susan	1,102,248
8	Joseph	2,300,049	Jessica	1,047,635
9	Thomas	2,134,536	Sarah	987,732
10	Christopher	2,049,683	Karen	986,072
11	Charles	2,037,956	Lisa	965,306
12	Daniel	1,905,388	Nancy	960,589
13	Matthew	1,620,154	Betty	886,110
14	Anthony	1,409,172	Sandra	873,576
15	Mark	1,349,030	Margaret	867,664
16	Donald	1,308,961	Ashley	852,892
17	Steven	1,284,623	Kimberly	842,541
18	Andrew	1,257,112	Emily	839,846
19	Paul	1,252,337	Donna	819,879
20	Joshua	1,231,302	Michelle	813,985
21	Kenneth	1,204,693	Carol	803,285
22	Kevin	1,178,755	Amanda	773,876
23	Brian	1,170,328	Melissa	755,534
24	George	1,085,858	Deborah	740,449
25	Timothy	1,074,172	Stephanie	739,354
26	Ronald	1,071,731	Dorothy	735,900
27	Jason	1,043,551	Rebecca	729,249
28	Edward	1,041,890	Sharon	720,831
29	Jeffrey	977,308	Laura	711,837
30	Ryan	952,133	Cynthia	705,803
31	Jacob	947,952	Amy	683,154
32	Gary	900,434	Kathleen	679,592
33	Nicholas	899,086	Angela	660,294
34	Eric	882,217	Shirley	651,356
35	Jonathan	857,270	Brenda	606,300
36	Stephen	837,588	Emma	600,812
37	Larry	801,849	Anna	596,649
38	Justin	783,529	Pamela	592,701
39	Scott	770,424	Nicole	591,425
40	Brandon	765,418	Samantha	584,239
41	Benjamin	758,472	Katherine	565,185
42	Samuel	721,821	Christine	556,599
43	Gregory	708,305	Helen	552,703
44	Alexander	691,200	Debra	548,274
45	Patrick	666,181	Rachel	545,644
46	Frank	660,209	Carolyn	537,523
47	Raymond	646,002	Janet	535,102
48	Jack	633,602	Maria	530,981
49	Dennis	610,563	Catherine	527,338
50	Jerry	600,515	Heather	524,158
51	Tyler	597,268	Diane	515,002
52	Aaron	592,045	Olivia	514,993
53	Jose	568,068	Julie	507,070
54	Adam	560,808	Joyce	496,038
55	Nathan	558,970	Victoria	492,988
56	Henry	552,968	Ruth	492,514
57	Zachary	545,562	Virginia	478,066
58	Douglas	545,422	Lauren	472,870
59	Peter	535,380	Kelly	472,293
60	Kyle	482,820	Christina	471,271
61	Noah	464,528	Joan	463,668
62	Ethan	462,185	Evelyn	453,238
63	Jeremy	442,079	Judith	449,653
64	Walter	441,463	Andrea	439,496
65	Christian	438,912	Hannah	439,385
66	Keith	430,292	Megan	438,548
67	Roger	425,514	Cheryl	436,892
68	Terry	422,214	Jacqueline	420,029
69	Austin	421,556	Martha	408,819
70	Sean	421,344	Madison	404,874
71	Gerald	418,373	Teresa	403,495
72	Carl	411,580	Gloria	402,354
73	Harold	408,283	Sara	399,548
74	Dylan	397,475	Janice	398,076
75	Arthur	392,380	Ann	397,270
76	Lawrence	391,246	Kathryn	395,600
77	Jordan	390,269	Abigail	395,172
78	Jesse	386,986	Sophia	388,604
79	Bryan	385,005	Frances	384,820
80	Billy	374,725	Jean	381,720
81	Bruce	374,490	Alice	380,182
82	Gabriel	373,275	Judy	377,385
83	Joe	370,795	Isabella	376,977
84	Logan	366,868	Julia	376,489
85	Alan	353,230	Grace	374,617
86	Juan	351,173	Amber	371,731
87	Albert	348,721	Denise	371,274
88	Willie	347,731	Danielle	369,890
89	Elijah	341,144	Marilyn	368,240
90	Wayne	333,019	Beverly	367,097
91	Randy	328,589	Charlotte	366,983
92	Vincent	323,905	Natalie	363,042
93	Mason	320,453	Theresa	362,271
94	Roy	320,261	Diana	361,781
95	Ralph	312,806	Brittany	359,479
96	Bobby	312,771	Doris	356,209
97	Russell	312,092	Kayla	342,898
98	Bradley	309,375	Alexis	342,478
99	Philip	309,217	Lori	337,992
100	Eugene	308,677	Marie	337,979`;

const names = raw_names
	.split('\n')
	.filter(e => e)
	.map(e => e.split('\t'))
	.map(e => [e[1], e[3]])
	.flat()
	.filter(e => e)

export default names;