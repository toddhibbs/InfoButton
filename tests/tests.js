var app     = require('../../InfoButton/app'),
  	request = require('supertest'),
  	assert  = require("assert"),
	url = 'http://localhost:3002';

var observationTestsPost = { 'observation.c.c':'410942007',
'observation.c.cs':'2.16.840.1.113883.6.96',
'observation.v.c':'855350',
'observation.v.cs':'2.16.840.1.113883.6.88',
'observation.v.dn':'Warfarin+Sodium+0.5+MG+Oral+Tablet',
'observation.c.c1':'410942007',
'observation.c.cs1':'2.16.840.1.113883.6.96',
'observation.v.c1':'858813',
'observation.v.cs1':'2.16.840.1.113883.6.88',
'observation.v.dn1':'Enalapril+Maleate+5+MG+Oral+Tablet',
'observation.c.c2':'416098002',
'observation.c.cs2':'2.16.840.1.113883.6.96',
'observation.v.c2':'70618',
'observation.v.cs2':'2.16.840.1.113883.6.88',
'observation.v.dn2':'penicillin',
'observation.valueNegationInd3':'true',
'observation.c.c3':'ASSERTION',
'observation.c.cs3':'2.16.840.1.113883.5.4',
'observation.v.c3':'38341003',
'observation.v.cs3':'2.16.840.1.113883.6.96',
'observation.v.dn3':'Hypertensive+disorder',
'observation.v.ot3':'hypertension'};


var observationTests = '/debug?observation.c.c=410942007&\
observation.c.cs=2.16.840.1.113883.6.96&\
observation.v.c=855350&\
observation.v.cs=2.16.840.1.113883.6.88&\
observation.v.dn=Warfarin+Sodium+0.5+MG+Oral+Tablet&\
observation.c.c1=410942007&\
observation.c.cs1=2.16.840.1.113883.6.96&\
observation.v.c1=858813&\
observation.v.cs1=2.16.840.1.113883.6.88&\
observation.v.dn1=Enalapril+Maleate+5+MG+Oral+Tablet&\
observation.c.c2=416098002&\
observation.c.cs2=2.16.840.1.113883.6.96&\
observation.v.c2=70618&\
observation.v.cs2=2.16.840.1.113883.6.88&\
observation.v.dn2=penicillin&\
observation.valueNegationInd3=true&\
observation.c.c3=ASSERTION&\
observation.c.cs3=2.16.840.1.113883.5.4&\
observation.v.c3=38341003&\
observation.v.cs3=2.16.840.1.113883.6.96&\
observation.v.dn3=Hypertensive+disorder&\
observation.v.ot3=hypertension';

var observationTestsWithHeartFailure = '/debug?observation.c.c=410942007&\
observation.c.cs=2.16.840.1.113883.6.96&\
observation.v.c=855350&\
observation.v.cs=2.16.840.1.113883.6.88&\
observation.v.dn=Warfarin+Sodium+0.5+MG+Oral+Tablet&\
observation.c.c1=410942007&\
observation.c.cs1=2.16.840.1.113883.6.96&\
observation.v.c1=858813&\
observation.v.cs1=2.16.840.1.113883.6.88&\
observation.v.dn1=Enalapril+Maleate+5+MG+Oral+Tablet&\
observation.c.c2=416098002&\
observation.c.cs2=2.16.840.1.113883.6.96&\
observation.v.c2=70618&\
observation.v.cs2=2.16.840.1.113883.6.88&\
observation.v.dn2=penicillin&\
observation.valueNegationInd3=true&\
observation.c.c3=ASSERTION&\
observation.c.cs3=2.16.840.1.113883.5.4&\
observation.v.c3=38341003&\
observation.v.cs3=2.16.840.1.113883.6.96&\
observation.v.dn3=Hypertensive+disorder&\
observation.v.ot3=hypertension&\
observation.c.c4=ASSERTION&\
observation.c.cs4=2.16.840.1.113883.5.4&\
observation.v.c4=84114007&\
observation.v.cs4=2.16.840.1.113883.6.96&\
observation.v.dn4=Heart+failure';

var observationTestsUnknownHypertension = '/debug?observation.c.c=410942007&\
observation.c.cs=2.16.840.1.113883.6.96&\
observation.v.c=855350&\
observation.v.cs=2.16.840.1.113883.6.88&\
observation.v.dn=Warfarin+Sodium+0.5+MG+Oral+Tablet&\
observation.c.c1=410942007&\
observation.c.cs1=2.16.840.1.113883.6.96&\
observation.v.c1=858813&\
observation.v.cs1=2.16.840.1.113883.6.88&\
observation.v.dn1=Enalapril+Maleate+5+MG+Oral+Tablet&\
observation.c.c2=416098002&\
observation.c.cs2=2.16.840.1.113883.6.96&\
observation.v.c2=70618&\
observation.v.cs2=2.16.840.1.113883.6.88&\
observation.v.dn2=penicillin&\
observation.nullFlavor3=UNK&\
observation.c.c3=ASSERTION&\
observation.c.cs3=2.16.840.1.113883.5.4&\
observation.v.c3=38341003&\
observation.v.cs3=2.16.840.1.113883.6.96&\
observation.v.dn3=Hypertensive+disorder&\
observation.v.ot3=hypertension';

var male77WithBacterialPneumonia = '/debug?knowledgeRequestNotification.effectiveTime.v=20060706001023&\
patientPerson.administrativeGenderCode.c=M&\
patientPerson.administrativeGenderCode.dn=Male&\
age.v.v=77&\
age.v.u=a&\
ageGroup.v.c=D000368&\
ageGroup.v.cs=2.16.840.1.113883.6.177&\
ageGroup.v.dn=Aged&\
taskContext.c.c=PROBLISTREV&\
taskContext.c.dn=Problem+list+review&\
subTopic.v.c=Q000628&subTopic.v.cs=2.16.840.1.113883.6.177&\
subTopic.v.dn=therapy&\
mainSearchCriteria.v.c=D018410&mainSearchCriteria.v.cs=2.16.840.1.113883.6.177&\
mainSearchCriteria.v.dn=Bacterial+Pneumonia&\
mainSearchCriteria.v.ot=Pneumonia'

var female8AlbuterolSulfate = '/debug?knowledgeRequestNotification.effectiveTime.v=20060706001023&\
patientPerson.administrativeGenderCode.c=F&\
age.v.v=8&\
age.v.u=a&\
taskContext.c.c=MEDLISTREV&\
performer=PROV&\
informationRecipient=PAT&\
performer.languageCode.c=en&\
informationRecipient.languageCode.c=es&\
performer.healthCareProvider.c.c=163W00000X&\
mainSearchCriteria.v.c=49502-693-03&\
mainSearchCriteria.v.cs=2.16.840.1.113883.6.69&\
mainSearchCriteria.v.dn=Albuterol+sulfate+inhalation+solution+1.25+mg&\
mainSearchCriteria.v.ot= Albuterol+sulfate'

var female67Dosing = '/debug?knowledgeRequestNotification.effectiveTime.v=20120706001023&\
patientPerson.administrativeGenderCode.c=F&\
age.v.v=67&\
age.v.u=a&\
taskContext.c.c=MEDOE&\
performer=PROV&\
performer.healthCareProvider.c.c=200000000X&\
encounter.c.c=AMB&\
mainSearchCriteria.v.c=197379&\
mainSearchCriteria.v.cs=2.16.840.1.113883.6.88& mainSearchCriteria.v.dn=Atenolol 100 mg Oral Tablet&\
mainSearchCriteria.v.ot=Atenolol&\
observation.v.c= 102811001&\
observation.v.cs=2.16.840.1.113883.6.96&\
observation.v.v=65&\
observation.v.u=mL/min&\
subtopic.v.c=Q000008&\
subtopic.v.cs=2.16.840.1.113883.6.177&\
subtopic.v.dn=administration+and+dosage'

describe('Parses InfoButton parameters correctly', function(){

  it('should parse KnowledgeRequestNotification', function(done){
    request(url)
        .get(male77WithBacterialPneumonia)
        .expect(200)
        .end(function(err, res){
        	assert.equal(res.body.KnowledgeRequestNotification.effectiveTime, 20060706001023)
            done();
        })
  });

  it('should parse AssignedEntity', function(done){
    request(url)
        .get(female67Dosing + 
'&holder.assignedEntity.n=1&\
holder.assignedEntity.certificateText=test&\
assignedAuthorizedPerson.id.root=2&\
representedOrganization.id.root=3&\
assignedEntity.representedOrganization.n=org')
        .expect(200)
        .end(function(err, res){
        	
        	assert.equal(res.body.AssignedEntity.assignedAuthorizedPerson.id, 2)
        	assert.equal(res.body.AssignedEntity.representedOrganization.id, 3)
        	assert.equal(res.body.AssignedEntity.representedOrganization.name, 'org') 
        	assert.equal(res.body.AssignedEntity.name, 1)
        	assert.equal(res.body.AssignedEntity.certificateText, 'test')     	
            done();
        })
  });

  it('should parse Patient details', function(done){
    request(url)
        .get(male77WithBacterialPneumonia)
        .expect(200)
        .end(function(err, res){
        	assert.equal(res.body.Patient.administrativeGender.code, 'M');

        	assert.equal(res.body.Patient.age.value, 77);
        	assert.equal(res.body.Patient.age.unit, 'a');

        	assert.equal(res.body.Patient.ageGroup.code, 'D000368')
        	assert.equal(res.body.Patient.ageGroup.codeSystem, '2.16.840.1.113883.6.177')
        	assert.equal(res.body.Patient.ageGroup.displayName, 'Aged')
        	assert.equal(res.body.Patient.isPregnant, false);

            done();
        })
  });

  it('should determne if a patient is pregnant', function(done){
    request(url)
        .get('/debug?observation.c.cs=2.16.840.1.113883.5.4&observation.v.c=77386006&observation.v.cs=2.16.840.1.113883.6.96')
        .expect(200)
        .end(function(err, res){
        	// assert.equal(res.body.Patient.administrativeGender.code, 'M');

        	// assert.equal(res.body.Patient.age.value, 77);
        	// assert.equal(res.body.Patient.age.unit, 'a');

        	// assert.equal(res.body.Patient.ageGroup.code, 'D000368')
        	// assert.equal(res.body.Patient.ageGroup.codeSystem, '2.16.840.1.113883.6.177')
        	// assert.equal(res.body.Patient.ageGroup.displayName, 'Aged')
        	assert.equal(res.body.Patient.isPregnant, true);

            done();
        })
  });

  it('should determne if a patient is lactating', function(done){
    request(url)
        .get('/debug?observation.c.cs=2.16.840.1.113883.5.4&observation.v.dn=Breastfeeding&observation.v.c=169745008&observation.v.cs=2.16.840.1.113883.6.96')
        .expect(200)
        .end(function(err, res){
          // assert.equal(res.body.Patient.administrativeGender.code, 'M');

          // assert.equal(res.body.Patient.age.value, 77);
          // assert.equal(res.body.Patient.age.unit, 'a');

          // assert.equal(res.body.Patient.ageGroup.code, 'D000368')
          // assert.equal(res.body.Patient.ageGroup.codeSystem, '2.16.840.1.113883.6.177')
          // assert.equal(res.body.Patient.ageGroup.displayName, 'Aged')
          assert.equal(res.body.Patient.isLactating, true);

            done();
        })
  });

  it('should parse TaskContext', function(done){
    request(url)
        .get('/debug?taskContext.c.c=1&taskContext.c.dn=AAA')
        .expect(200)
        .end(function(err, res){
        	assert.equal(res.body.TaskContext.code, 1)
        	assert.equal(res.body.TaskContext.displayName, 'AAA')
            done();
        })
  });

  it('should parse SubTopic', function(done){
    request(url)
        .get('/debug?subTopic.v.c=1&subTopic.v.cs=SNOMED&subTopic.v.dn=Diabetes&subTopic.v.ot=Diabetes')
        .expect(200)
        .end(function(err, res){
        	assert.equal(res.body.SubTopic.code, 1)
        	assert.equal(res.body.SubTopic.codeSystem, 'SNOMED')
        	assert.equal(res.body.SubTopic.displayName, 'Diabetes')
        	assert.equal(res.body.SubTopic.originalText, 'Diabetes')
            done();
        })
  });

  it('should parse SeverityObservation', function(done){
    request(url)
        .get('/debug?severityObservation.interpretationCode.c=1&severityObservation.interpretationCode.cs=SNOMED&severityObservation.interpretationCode.dn=Diabetes')
        .expect(200)
        .end(function(err, res){
        	assert.equal(res.body.SeverityObservation.code, 1)
        	assert.equal(res.body.SeverityObservation.codeSystem, 'SNOMED')
        	assert.equal(res.body.SeverityObservation.displayName, 'Diabetes')
            done();
        })
  });

  it('should parse InformationRecipient', function(done){
    request(url)
        .get('/debug?informationRecipient.healthCareProvider.c.c=1&informationRecipient.healthCareProvider.c.cs=SNOMED&informationRecipient.healthCareProvider.c.dn=John Doe&informationRecipient.languageCode.c=2')
        .expect(200)
        .end(function(err, res){
        	assert.equal(res.body.InformationRecipient.healthCareProvider.code, 1)
        	assert.equal(res.body.InformationRecipient.healthCareProvider.codeSystem, 'SNOMED')
        	assert.equal(res.body.InformationRecipient.healthCareProvider.displayName, 'John Doe')
        	assert.equal(res.body.InformationRecipient.language, 2)
            done();
        })
  });

  it('should parse Performer', function(done){
    request(url)
        .get('/debug?performer.healthCareProvider.c.c=1&performer.healthCareProvider.c.cs=SNOMED&performer.healthCareProvider.c.dn=Medical Center&performer.languageCode.c=2')
        .expect(200)
        .end(function(err, res){
        	assert.equal(res.body.Performer.healthCareProvider.code, 1)
        	assert.equal(res.body.Performer.healthCareProvider.codeSystem, 'SNOMED')
        	assert.equal(res.body.Performer.healthCareProvider.displayName, 'Medical Center')
        	assert.equal(res.body.Performer.language, 2)
            done();
        })
  });

  it('should set performer and informationRecipient flags', function(done) {
  	request(url)
  	.get(female8AlbuterolSulfate)
  	.expect(200)
  	.end(function(err, res) {
  		//console.log(JSON.stringify(res.body, null, 2))
  		assert.equal(res.body.Performer.isHealthCareProvider, true);
  		assert.equal(res.body.Performer.isPatient, false);
  		assert.equal(res.body.Performer.isPayor, false);
  		assert.equal(res.body.InformationRecipient.isHealthCareProvider, false);
  		assert.equal(res.body.InformationRecipient.isPatient, true);
  		assert.equal(res.body.InformationRecipient.isPayor, false);
  		done();
  	})
  });

  it('should parse Encounter', function(done){
    request(url)
        .get('/debug?encounter.c.c=1&encounter.c.cs=SNOMED&encounter.c.dn=enc&serviceDeliveryLocation.id.root=1')
        .expect(200)
        .end(function(err, res){
        	assert.equal(res.body.Encounter.code, 1);
        	assert.equal(res.body.Encounter.codeSystem, 'SNOMED');
        	assert.equal(res.body.Encounter.displayName, 'enc');
        	assert.equal(res.body.Encounter.serviceDeliveryLocation.id, 1);
            done();
        })
  });

  it('should parse a single Observation', function(done){
    request(url)
        .get('/debug?observation.c.c=1&observation.c.cs=SNOMED&observation.c.dn=obs&observation.v.c=1&observation.v.cs=SNOMED&observation.v.dn=weight&observation.v.v=100&observation.v.u=kg')
        .expect(200)
        .end(function(err, res){
        	assert.equal(res.body.Observations.length, 1)
        	assert.equal(res.body.Observations[0].code.code, 1)
        	assert.equal(res.body.Observations[0].code.codeSystem, 'SNOMED')
        	assert.equal(res.body.Observations[0].code.displayName, 'obs')
        	assert.equal(res.body.Observations[0].value.code, 1)
        	assert.equal(res.body.Observations[0].value.codeSystem, 'SNOMED')
        	assert.equal(res.body.Observations[0].value.displayName, 'weight')
        	assert.equal(res.body.Observations[0].value.value, 100)
        	assert.equal(res.body.Observations[0].value.unit, 'kg')
            done();
        })
  });

  it('should add ASSERTION to Observation code if code is omitted', function(done){
    request(url)
        .get('/debug?observation.c.cs=2.16.840.1.113883.5.4&observation.v.c=77386006&observation.v.cs=2.16.840.1.113883.6.96')
        .expect(200)
        .end(function(err, res){        	
        	assert.equal(res.body.Observations.length, 1)
        	assert.equal(res.body.Observations[0].code.code, 'ASSERTION')
            done();
        })
  });

  it('should parse negated observation', function(done){
    request(url)
        .get(observationTests)
        .expect(200)
        .end(function(err, res){     

        	//console.log(JSON.stringify(res.body, null, 3))

        	assert.equal(res.body.Observations.length, 4);
        	assert.equal(res.body.Observations[3].code.code, 'ASSERTION');
        	assert.equal(res.body.Observations[3].value.valueNegationInd, true);
            done();
        })
  });

  it('should parse unknown observation', function(done){
    request(url)
        .get(observationTestsUnknownHypertension)
        .expect(200)
        .end(function(err, res){     

        	//console.log(JSON.stringify(res.body, null, 3))

        	assert.equal(res.body.Observations.length, 4);
        	assert.equal(res.body.Observations[3].code.code, 'ASSERTION');
        	assert.equal(res.body.Observations[3].value.valueNegationInd, false);
        	assert.equal(res.body.Observations[3].value.nullFlavor, 'UNK');
            done();
        })
  });

  it('should parse a second Observation', function(done){
    request(url)
        .get('/debug?observation.c.cs=2.16.840.1.113883.5.4&\
observation.v.c=77386006&\
observation.v.cs=2.16.840.1.113883.6.96&\
\
observation.c.c1=8310-5&\
observation.c.cs1=2.16.840.1.113883.6.1&\
observation.v.v1=39.2&\
observation.v.u1=Cel')
        .expect(200)
        .end(function(err, res){

			//console.log(JSON.stringify(res.body, null, 3))

        	assert.equal(res.body.Observations.length, 2)

        	assert.equal(res.body.Observations[0].code.codeSystem, '2.16.840.1.113883.5.4')
        	assert.equal(res.body.Observations[0].value.code, '77386006')
        	assert.equal(res.body.Observations[0].value.codeSystem, '2.16.840.1.113883.6.96')

        	assert.equal(res.body.Observations[1].code.codeSystem, '2.16.840.1.113883.6.1')
        	assert.equal(res.body.Observations[1].code.code, '8310-5')
        	assert.equal(res.body.Observations[1].value.value, '39.2')
        	assert.equal(res.body.Observations[1].value.unit, 'Cel')

            done();
        })
  });

  it('should parse MainSearchCriteria', function(done){
    request(url)
        .get('/debug?mainSearchCriteria.v.c=1&mainSearchCriteria.v.cs=SNOMED&mainSearchCriteria.v.dn=Diabetes&mainSearchCriteria.v.ot=Diabetes')
        .expect(200)
        .end(function(err, res){
        	// console.log(JSON.stringify(res.body, null, 3))
        	assert.equal(res.body.MainSearchCriteria[0].code, 1)
        	assert.equal(res.body.MainSearchCriteria[0].codeSystem, 'SNOMED')
        	assert.equal(res.body.MainSearchCriteria[0].displayName, 'Diabetes')
        	assert.equal(res.body.MainSearchCriteria[0].originalText, 'Diabetes')
            done();
        })
  });

    it('should parse multiple MainSearchCriteria', function(done){
    request(url)
        .get('/debug?mainSearchCriteria.v.c=1202&\
mainSearchCriteria.v.cs=2.16.840.1.113883.6.88&\
mainSearchCriteria.v.dn=atenolol&\
mainSearchCriteria.v.c1=401.1&\
mainSearchCriteria.v.cs1=2.16.840.1.113883.6.103&\
mainSearchCriteria.v.dn1=Benign+essential+hypertension&\
mainSearchCriteria.v.c2=250&\
mainSearchCriteria.v.cs2=2.16.840.1.113883.6.103&\
mainSearchCriteria.v.dn2=Diabetes+mellitus')
        .expect(200)
        .end(function(err, res){
        	//console.log(JSON.stringify(res.body, null, 3))

        	assert.equal(res.body.MainSearchCriteria[0].code, '1202');
        	assert.equal(res.body.MainSearchCriteria[0].codeSystem, '2.16.840.1.113883.6.88');
        	assert.equal(res.body.MainSearchCriteria[0].displayName, 'atenolol');

        	assert.equal(res.body.MainSearchCriteria[1].code, '401.1');
        	assert.equal(res.body.MainSearchCriteria[1].codeSystem, '2.16.840.1.113883.6.103');
        	assert.equal(res.body.MainSearchCriteria[1].displayName, 'Benign essential hypertension');

        	assert.equal(res.body.MainSearchCriteria[2].code, '250');
        	assert.equal(res.body.MainSearchCriteria[2].codeSystem, '2.16.840.1.113883.6.103');
        	assert.equal(res.body.MainSearchCriteria[2].displayName, 'Diabetes mellitus');
            done();
        })
  });


  it('should parse LocationOfInterest', function(done){
    request(url)
        .get('/debug?locationOfInterest.addr.ZIP=98052&locationOfInterest.addr.CTY=Redmond&locationOfInterest.addr.STA=WA&locationOfInterest.addr.CNT=US')
        .expect(200)
        .end(function(err, res){
        	assert.equal(res.body.LocationOfInterest.address.zip, 98052)
        	assert.equal(res.body.LocationOfInterest.address.city, 'Redmond')
        	assert.equal(res.body.LocationOfInterest.address.state, 'WA')
        	assert.equal(res.body.LocationOfInterest.address.country, 'US')
            done();
        })
  });


});

describe('Builds search parameters correctly', function(){
  it('should create an empty SearchQuery on request object', function(done){
    request(url)
        .get(male77WithBacterialPneumonia)
        .expect(200)
        .end(function(err, res){
        	assert.notEqual(res.body.SearchQuery.indexOf('q='), -1);
            done();
        })
  });

  it('should create a SearchQuery when passing in search parameters', function(done){
    request(url)
        .get(male77WithBacterialPneumonia)
        .expect(200)
        .end(function(err, res){
			
			 //console.log(JSON.stringify(res.body, null, 3))

        	assert.notEqual(res.body.SearchQuery.indexOf('q=Bacterial Pneumonia'), -1)
            done();
        })
  });

  it('should derive medications from appropriate observations', function(done){
    request(url)
        .get(observationTests)
        .expect(200)
        .end(function(err, res){
        	//console.log(JSON.stringify(res.body, null, 3))

        	assert.equal(res.body.Medications.length, 2)
            done();
        })
  });

  it('should derive medication allergies from appropriate observations', function(done){
    request(url)
        .get(observationTests)
        .expect(200)
        .end(function(err, res){
        	//console.log(JSON.stringify(res.body, null, 3))

        	assert.equal(res.body.MedicationAllergies.length, 1);
            done();
        })
  });

  it('should derive problems from appropriate observations - filter out negated or unknown problems', function(done){
    request(url)
        .get(observationTestsWithHeartFailure)
        .expect(200)
        .end(function(err, res){
        	// console.log(JSON.stringify(res.body, null, 3))

        	assert.equal(res.body.Problems.length, 1);
            done();
        })
  });

  it('should derive unknown problems from appropriate observations', function(done){
    request(url)
        .get(observationTestsUnknownHypertension)
        .expect(200)
        .end(function(err, res){
        	// console.log(JSON.stringify(res.body, null, 3))

        	assert.equal(res.body.ProblemsUnknown.length, 1);
            done();
        })
  });

  it('should derive negated problems from appropriate observations', function(done){
    request(url)
        .get(observationTests)
        .expect(200)
        .end(function(err, res){
        	// console.log(JSON.stringify(res.body, null, 3))

			assert.equal(err, undefined)
        	assert.equal(res.body.ProblemsNegated.length, 1);
            done();
        })
  });

  it('should derive vitalsigns from appropriate observations', function(done){
    request(url)
        .get('/debug?observation.c.c=8310-5&observation.c.cs=2.16.840.1.113883.6.1&observation.v.v=39.2&observation.v.u=Cel')
        .expect(200)
        .end(function(err, res){
        	console.log(JSON.stringify(res.body, null, 3))

        	assert.equal(res.body.VitalSigns.length, 1);
        	assert.equal(res.body.VitalSigns[0].code.code, '8310-5');
        	assert.equal(res.body.VitalSigns[0].value.value, '39.2');
        	assert.equal(res.body.VitalSigns[0].value.unit, 'Cel');
            done();
        })
  });

  it('should handle post request', function(done){
    request(url)
        .post('/debug')
        .send(observationTestsPost)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
        	
        	//console.log(JSON.stringify(res.body, null, 3))

        	assert.equal(err, undefined);
        	assert.equal(res.body.ProblemsNegated.length, 1);
        	assert.equal(res.body.Medications.length, 2);
            done();
        })
  });

  it('should derive broad age group from patient agegroup - neonatal', function(done){
    request(url)
        .get('/debug?ageGroup.v.cs=2.16.840.1.113883.6.177&ageGroup.v.c=D007231')
        .expect(200)
        .end(function(err, res){
          // console.log(JSON.stringify(res.body, null, 3))

          assert.equal(res.body.Patient.broadAgeGroup, 'neonatal');
          done();
        })
  });

  it('should derive broad age group from patient agegroup - pediatric', function(done){
    request(url)
        .get('/debug?ageGroup.v.cs=2.16.840.1.113883.6.177&ageGroup.v.c=D002648')
        .expect(200)
        .end(function(err, res){
          //console.log(JSON.stringify(res.body, null, 3))

          assert.equal(res.body.Patient.broadAgeGroup, 'pediatric');
          done();
        })
  });

  it('should derive broad age group from patient agegroup - adult', function(done){
    request(url)
        .get('/debug?ageGroup.v.cs=2.16.840.1.113883.6.177&ageGroup.v.c=D008875')
        .expect(200)
        .end(function(err, res){
          //console.log(JSON.stringify(res.body, null, 3))

          assert.equal(res.body.Patient.broadAgeGroup, 'adult');
          done();
        })
  });

  it('should derive broad age group from patient agegroup - unknown agegroup code', function(done){
    request(url)
        .get('/debug?ageGroup.v.cs=2.16.840.1.113883.6.177&ageGroup.v.c=AAAAAAA')
        .expect(200)
        .end(function(err, res){
          //console.log(JSON.stringify(res.body, null, 3))

          assert.equal(res.body.Patient.broadAgeGroup, 'adult');
          done();
        })
  });

  it('should derive broad age group from patient agegroup - geriatric', function(done){
    request(url)
        .get('/debug?ageGroup.v.cs=2.16.840.1.113883.6.177&ageGroup.v.c=D000369')
        .expect(200)
        .end(function(err, res){
          //console.log(JSON.stringify(res.body, null, 3))

          assert.equal(res.body.Patient.broadAgeGroup, 'geriatric');
          done();
        })
  });

  it('should derive broad age group from patient age - minutes', function(done){
    request(url)
        .get('/debug?age.v.v=200&age.v.u=min')
        .expect(200)
        .end(function(err, res){
          //console.log(JSON.stringify(res.body, null, 3))

          assert.equal(res.body.Patient.broadAgeGroup, 'neonatal');
          done();
        })
  });

  it('should derive broad age group from patient age - minutes', function(done){
    request(url)
        .get('/debug?age.v.v=41522401&age.v.u=min')
        .expect(200)
        .end(function(err, res){
          //console.log(JSON.stringify(res.body, null, 3))

          assert.equal(res.body.Patient.broadAgeGroup, 'geriatric');
          done();
        })
  });

  

  it('should derive broad age group from patient age - hours', function(done){
    request(url)
        .get('/debug?age.v.v=2&age.v.u=h')
        .expect(200)
        .end(function(err, res){
          //console.log(JSON.stringify(res.body, null, 3))

          assert.equal(res.body.Patient.broadAgeGroup, 'neonatal');
          done();
        })
  });

  it('should derive broad age group from patient age - hours', function(done){
    request(url)
        .get('/debug?age.v.v=1000&age.v.u=h')
        .expect(200)
        .end(function(err, res){
          //console.log(JSON.stringify(res.body, null, 3))

          assert.equal(res.body.Patient.broadAgeGroup, 'pediatric');
          done();
        })
  });

  it('should derive broad age group from patient age - months', function(done){
    request(url)
        .get('/debug?age.v.v=1000&age.v.u=mo')
        .expect(200)
        .end(function(err, res){
          //console.log(JSON.stringify(res.body, null, 3))

          assert.equal(res.body.Patient.broadAgeGroup, 'geriatric');
          done();
        })
  });

  it('should derive broad age group from patient age - months, pediatric', function(done){
    request(url)
        .get('/debug?age.v.v=203&age.v.u=mo')
        .expect(200)
        .end(function(err, res){
          //console.log(JSON.stringify(res.body, null, 3))

          assert.equal(res.body.Patient.broadAgeGroup, 'pediatric');
          done();
        })
  });

  it('should derive broad age group from patient age - months, adult', function(done){
    request(url)
        .get('/debug?age.v.v=204&age.v.u=mo')
        .expect(200)
        .end(function(err, res){
          //console.log(JSON.stringify(res.body, null, 3))

          assert.equal(res.body.Patient.broadAgeGroup, 'adult');
          done();
        })
  });



  //NOTE: this requires the search service to be running and for the infobutton project to have access to it. enable to verify setup is working
  
  // it('should be able to get results from search service', function(done){
  //   request(url)
  //       .post('/search')
  //       .send(male77WithBacterialPneumonia)
  //       .expect(200)
  //       .end(function(err, res){
        	
  //       	console.log(JSON.stringify(res, null, 3))

  //       	assert.equal(err, undefined);
  //           done();
  //       })
  // });

  // it('should be able to get results from search service', function(done){
  //   request(url)
  //       .get('/search?age.v.v=204&age.v.u=mo')
  //       .expect(200)
  //       .end(function(err, res){
          
  //         console.log(JSON.stringify(res, null, 3))

  //         assert.equal(err, undefined);
  //         done();
  //       })
  // });




});

