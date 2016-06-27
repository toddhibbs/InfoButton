var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var ArticleSchema = new Schema({
	NewsletterID: Number,
	Date: Date,
	Volume: String,
	Number: String,
	Month: String,
	Year: String,
	Category: String,
	Country: String,
	Section: String,
	Topic: String,
	ArticleA: String,
	Detail: Number,
	Reference: String,
	TopicText: String,
	ViewOrder: Number,
	RumorID: Number,
	ArticleText: String,
	ReferenceFull: String,
	Keywords: String,
	NewDrugID: Number,
	Description: String,
	DescriptionText: String,
	IncludedForEB: Boolean,
	MedGuide: Boolean,
	Snippet: String
});

var DetailSchema = new Schema({
	Detail: Number,
	Date: Date,
	DetailContents: String,
	DetailText: String,
	Handheld: Boolean,
	Chart: Boolean,
	PDF: Boolean,
	PTHandout: Boolean,
	Title: String,
	CheckedOutUser: String,
	CheckedOutDate: Date,
	Keywords: String,
	ChartHeader: String,
	ChartFooter: String,
	ReplacedByDetail: Number,
	ReplacedByDetailCan: Number,
	Description: String,
	DescriptionText: String,
	Segmented: Boolean,
	PTResource: Boolean,
	PTResourceCan: Boolean,
	SegmentTitles: String,
	DDOnly: Boolean
});


var DetailSegmentSchema = new Schema({
	Detail: Number,
	SegmentID: Number,
	Identifier: String,
	Title: String,
	Type: String,
	Heading: String,
	Intro: String,
	Content: String,
	ViewOrder: Number,
	PDF: Boolean,
	Hyperlink: String,
	FromDetail: Number,
	FromSegmentID: Number,
	PDFInclude: Boolean,
	ShowPrintLink: Boolean
});

var CategorySchema = new Schema({
	CategoryID: Number,
	CategoryDescription: String,
	ParentCategoryID: Number,
	ViewOrder: Number,
	Keywords: String,
	ShowRefine: Boolean,
	RefineText: String,
	SortOrder: String,
	CloneFromCategoryID:: Number
});