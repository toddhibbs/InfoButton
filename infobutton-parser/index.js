var _ = require('lodash');

module.exports = function InfoButtonParser() {
	return function InfoButtonParser(req, res, next) {
		var o = null;
		req.InfoButton = {};

		req.InfoButton.KnowledgeRequestNotification = KnowledgeRequestNotification(req);
		req.InfoButton.Patient = Patient(req);
		req.InfoButton.AssignedEntity = AssignedEntity(req);
		req.InfoButton.TaskContext = TaskContext(req);
		req.InfoButton.Encounter = Encounter(req);
		req.InfoButton.SubTopic = SubTopic(req);
		req.InfoButton.LocationOfInterest = LocationOfInterest(req);
		req.InfoButton.SeverityObservation = SeverityObservation(req);
		req.InfoButton.Performer = Performer(req);
		req.InfoButton.InformationRecipient = InformationRecipient(req);
		req.InfoButton.MainSearchCriteria = MainSearchCriteria(req);
		req.InfoButton.Observations = Observations(req);

		//these are derived attributes to simplify looking up observation data. 
		//the actual data comes from the observations
		req.InfoButton.Patient.isPregnant = IsPregnant(req.InfoButton.Patient, req.InfoButton.Observations);
		req.InfoButton.Patient.isLactating = IsLactating(req.InfoButton.Patient, req.InfoButton.Observations);
		req.InfoButton.Medications = Medications(req.InfoButton.Observations);
		req.InfoButton.MedicationAllergies = MedicationAllergies(req.InfoButton.Observations);
		req.InfoButton.Problems = Problems(req.InfoButton.Observations);
		req.InfoButton.ProblemsNegated = ProblemsNegated(req.InfoButton.Observations);
		req.InfoButton.ProblemsUnknown = ProblemsUnknown(req.InfoButton.Observations);
		req.InfoButton.VitalSigns = VitalSigns(req.InfoButton.Observations);

		//add a less specific age group based on either age or agegroup on patient
		req.InfoButton.Patient.broadAgeGroup = BroadAgeGroup(req.InfoButton.Patient);

		next();
	}
};


function VitalSigns(observations) {
	//returns array of observations that are loinc vital signs

	return _.filter(observations, function(item) {
		if (item.code.codeSystem == '2.16.840.1.113883.6.1') {
			return true;
		}
		return false;
	});
};

function Medications(observations) {
	//returns array of observations that are medications

	return _.filter(observations, function(item) {
		if (item.code.code == '410942007' && item.code.codeSystem == '2.16.840.1.113883.6.96') {
			return true;
		}
		return false;
	});
};

function MedicationAllergies(observations) {
	//returns array of observations that are medication allergies

	return _.filter(observations, function(item) {
		if (item.code.code == '416098002' && item.code.codeSystem == '2.16.840.1.113883.6.96') {
			return true;
		}
		return false;
	});
};

function Problems(observations) {
	//returns array of observations that are problems
	//null or negated problems are not included

	return _.filter(observations, function(item) {
		if (item.code.code == 'ASSERTION' && item.code.codeSystem == '2.16.840.1.113883.5.4' && 
			!item.value.valueNegationInd && !item.value.nullFlavor
			&& !(item.value.code == '77386006' && item.value.codeSystem == '2.16.840.1.113883.6.96')) {
			//filters out pregnancy and null or negated observations
			return true;
		}
		return false;
	});
};

function ProblemsNegated(observations) {
	//returns array of observations that are negated problems

	return _.filter(observations, function(item) {
		if (item.code.code == 'ASSERTION' && item.code.codeSystem == '2.16.840.1.113883.5.4' && 
			item.value.valueNegationInd && !item.value.nullFlavor) {
			return true;
		}
		return false;
	});
};

function ProblemsUnknown(observations) {
	//returns array of observations that are unknown problems

	return _.filter(observations, function(item) {
		if (item.code.code == 'ASSERTION' && item.code.codeSystem == '2.16.840.1.113883.5.4' && 
			!item.value.valueNegationInd && item.value.nullFlavor) {
			return true;
		}
		return false;
	});
};

function IsPregnant(patient, observations) {
	if (patient.administrativeGender.code == 'M') {
		return false;
	}

	var o = _.find(observations, function(item) {
		return item.code.code == 'ASSERTION' && item.code.codeSystem == '2.16.840.1.113883.5.4' &&
			item.value.code == '77386006' && item.value.codeSystem == '2.16.840.1.113883.6.96'
	});

	return o == undefined ? false : true;
};

function IsLactating(patient, observations) {
	//observation.c.cs=2.16.840.1.113883.5.4
	//observation.v.dn=Breastfeeding
	//observation.v.c=169745008
	//observation.v.cs=2.16.840.1.113883.6.96

	if (patient.administrativeGender.code == 'M') {
		return false;
	}

	var o = _.find(observations, function(item) {
		return item.code.codeSystem == '2.16.840.1.113883.5.4' &&
			item.value.code == '169745008' && item.value.codeSystem == '2.16.840.1.113883.6.96'
	});

	return o == undefined ? false : true;
}

function KnowledgeRequestNotification(req) {
	return {
		effectiveTime: req.param('knowledgeRequestNotification.effectiveTime.v')
	}
};

function Patient(req) {
	return {
		administrativeGender: {
			code: req.param('patientPerson.administrativeGenderCode.c'),
			displayName: req.param('patientPerson.administrativeGenderCode.dn')
		},
		age: {
			value: req.param('age.v.v'),
			unit: req.param('age.v.u')
		},
		ageGroup: {
			code: req.param('ageGroup.v.c'),
			codeSystem: req.param('ageGroup.v.cs'),
			displayName: req.param('ageGroup.v.dn')
		}
	}
};

function BroadAgeGroup(patient) {

	var broadAgeGroup;

	if (patient.ageGroup.code) {

		// ageGroup 
		// Concept domain: AgeGroupObservationValue 
		// Code system: MeSH  
		// Code system OID: 2.16.840.1.113883.6.177 
		// Value set: AgeGroupObservationValue  [2.16.840.1.113883.11.75] 
		// Extensions to the value set allowed (CWE): Yes 
		//  
		// Concept code  	Display name 
		// D007231			infant, newborn; birth to 1 month 
		// D007223  		Infant; 1 to 23 months 
		// D002675  		child, preschool; 2 to 5 years 
		// D002648  		child; 6 to 12 years 
		// D000293  		adolescent; 13‐18 years 
		// D055815  		young adult; 19‐24 years 
		// D000328 			adult; 19‐44 years 
		// D000368 			aged; 56‐79 years 
		// D008875 			middle aged; 45‐64 years 
		// D000369  		aged, 80 and older; a person 80 years of age and older 


		switch (patient.ageGroup.code) {
			case 'D007231':
				broadAgeGroup = 'neonatal';
				break;

			case 'D007223':
			case 'D002675':
			case 'D002648':
			case 'D000293':
				broadAgeGroup = 'pediatric';
				break;

			case 'D000369':
				broadAgeGroup = 'geriatric';
				break;

			case 'D055815':
			case 'D000328':
			case 'D000368':
			case 'D008875':
			default:
				broadAgeGroup = 'adult';
				break;
		}

	}
	else if (patient.age.unit) {
		//GE uses month units

		// Age units 
		// CodeSystem: Unified Code for Units of Measure (UCUM) 
		// Code system OID: 2.16.840.1.113883.6.8 
		// Value set: AgePQ_UCUM [2.16.840.1.113883.11.20.9.21]  
		// Extensions to the value set allowed (CWE): No 

		// Code  Display Name 
		// min  Minute 
		// h  Hour 
		// d  Day 
		// wk  Week 
		// mo  Month 
		// a  Year 

		var value = patient.age.value;

		switch (patient.age.unit) {
			case 'min':
				if (value < 43200) {
					//30 days in minutes. 60 * 24 * 30
					broadAgeGroup = 'neonatal';
				}
				else if (value < 8935200) {
					//17 years in minutes. 60 * 24 * 365 * 17
					broadAgeGroup = 'pediatric';
				}
				else if (value > 41522400) {
					//79 years in minutes. 60 * 24 * 365 * 79
					broadAgeGroup = 'geriatric';
				}
				else {
					broadAgeGroup = 'adult';
				}
				break;

			case 'h':
				if (value < 720) {
					//30 days in hours. 24 * 30
					broadAgeGroup = 'neonatal';
				}
				else if (value < 108120) {
					//17 years in hours. 24 * 365 * 17
					broadAgeGroup = 'pediatric';
				}
				else if (value > 692040) {
					//79 years in hours. 24 * 365 * 79
					broadAgeGroup = 'geriatric';
				}
				else {
					broadAgeGroup = 'adult';
				}
				break;

			case 'd':
				if (value < 30) {
					//30 days
					broadAgeGroup = 'neonatal';
				}
				else if (value < 6205) {
					//17 years in days. 365 * 17
					broadAgeGroup = 'pediatric';
				}
				else if (value > 28835) {
					//79 years in days. 365 * 79
					broadAgeGroup = 'geriatric';
				}
				else {
					broadAgeGroup = 'adult';
				}
				break;

			case 'wk':			
				if (value < 4) {
					//4 weeks
					broadAgeGroup = 'neonatal';
				}
				else if (value < 884) {
					//17 years in weeks. 52 * 17
					broadAgeGroup = 'pediatric';
				}
				else if (value > 4108) {
					//79 years in weeks. 52 * 79
					broadAgeGroup = 'geriatric';
				}
				else {
					broadAgeGroup = 'adult';
				}
				break;

			case 'mo':		
				if (value <= 1) {
					//1 month
					broadAgeGroup = 'neonatal';
				}
				else if (value < 204) {
					//17 years in months. 12 * 17
					broadAgeGroup = 'pediatric';
				}
				else if (value > 948) {
					//79 years in months. 12 * 79
					broadAgeGroup = 'geriatric';
				}
				else {
					broadAgeGroup = 'adult';
				}
				break;

			case 'a':
				if (value < 18) {					
					broadAgeGroup = 'pediatric';
				}
				else if (value > 80) {
					broadAgeGroup = 'geriatric';
				}
				else {
					broadAgeGroup = 'adult';
				}
				break;
		}
	}
	return broadAgeGroup;
};

function AssignedEntity(req) {
	return {
		name: req.param('holder.assignedEntity.n'),
		certificateText: req.param('holder.assignedEntity.certificateText'),

		assignedAuthorizedPerson: {
			id: req.param('assignedAuthorizedPerson.id.root')
		},
		representedOrganization: {
			id: req.param('representedOrganization.id.root'),
			name: req.param('assignedEntity.representedOrganization.n')
		}
	};
};

function TaskContext(req) {
	return {
		code: req.param('taskContext.c.c'),
		displayName: req.param('taskContext.c.dn')
	}
};

function SubTopic(req) {
	//use deprecated settings if the current one not available
	return {
		code: req.param('subTopic.v.c') ? req.param('subTopic.v.c') : (req.param('subTopic.c.c') ? req.param('subTopic.c.c') : undefined),
		codeSystem: req.param('subTopic.v.cs') ? req.param('subTopic.v.cs') : (req.param('subTopic.c.cs') ? req.param('subTopic.c.cs') : undefined),
		displayName: req.param('subTopic.v.dn') ? req.param('subTopic.v.dn') : (req.param('subTopic.c.dn') ? req.param('subTopic.c.dn') : undefined),
		originalText: req.param('subTopic.v.ot')
	}
};

function SeverityObservation(req) {
	return {
		code: req.param('severityObservation.interpretationCode.c'),
		codeSystem: req.param('severityObservation.interpretationCode.cs'),
		displayName: req.param('severityObservation.interpretationCode.dn')
	}
};

function InformationRecipient(req) {
	var type = req.param('informationRecipient');
	return {
		type: type,
		isPatient: type == 'PAT',
		isHealthCareProvider: type == 'PROV',
		isPayor: type == 'PAYOR',
		healthCareProvider: {
			code: req.param('informationRecipient.healthCareProvider.c.c'),
			codeSystem: req.param('informationRecipient.healthCareProvider.c.cs'),
			displayName: req.param('informationRecipient.healthCareProvider.c.dn')
		},
		language: req.param('informationRecipient.languageCode.c')
	}
};

function Performer(req) {
	var type = req.param('performer');
	return {
		type: type,
		isPatient: type == 'PAT',
		isHealthCareProvider: type == 'PROV',
		isPayor: type == 'PAYOR',
		healthCareProvider: {
			code: req.param('performer.healthCareProvider.c.c'),
			codeSystem: req.param('performer.healthCareProvider.c.cs'),
			displayName: req.param('performer.healthCareProvider.c.dn')
		},
		language: req.param('performer.languageCode.c')
	}
};

function Encounter(req) {
	return {
		code: req.param('encounter.c.c'),
		codeSystem: req.param('encounter.c.cs'),
		displayName: req.param('encounter.c.dn'),
		serviceDeliveryLocation: {
			id: req.param('serviceDeliveryLocation.id.root')
		}
	}
};

function Observation(req, index) {
	var code = index > 0 ? req.param('observation.c.c' + index) : req.param('observation.c.c');
	if (!code) {
		code = 'ASSERTION';
	}

	return {
		code: {
			code: code,
			codeSystem: index > 0 ? req.param('observation.c.cs' + index) : req.param('observation.c.cs'),
			displayName: index > 0 ? req.param('observation.c.dn' + index) : req.param('observation.c.dn')
		},		
		value: {
			code: index > 0 ? req.param('observation.v.c' + index) : req.param('observation.v.c'),
			codeSystem: index > 0 ? req.param('observation.v.cs' + index) : req.param('observation.v.cs'),
			displayName: index > 0 ? req.param('observation.v.dn' + index) : req.param('observation.v.dn'),
			value: index > 0 ? req.param('observation.v.v' + index) : req.param('observation.v.v'),
			unit: index > 0 ? req.param('observation.v.u' + index) : req.param('observation.v.u'),
			valueNegationInd: (index > 0 ? req.param('observation.valueNegationInd' + index) : req.param('observation.valueNegationInd')) == 'true',
			nullFlavor: index > 0 ? req.param('observation.nullFlavor' + index) : req.param('observation.nullFlavor')
		}		
	}
};

function ObservationPeek(req, index) {
	var codeSystem = index > 0 ? req.param('observation.c.cs' + index) : req.param('observation.c.cs');
	return codeSystem == undefined ? false : true;
};

function Observations(req) {
	//loop through observations
	var observations = [];
	var index = 0;

	while (ObservationPeek(req, index)) {
		
		observations.push(Observation(req, index));
		index++;
		
	}
	return observations;	
};

function _MainSearchCriteria(req, index) {
	return {
		code: index > 0 ? req.param('mainSearchCriteria.v.c' + index) : req.param('mainSearchCriteria.v.c'),
		codeSystem: index > 0 ? req.param('mainSearchCriteria.v.cs' + index) : req.param('mainSearchCriteria.v.cs'),
		displayName: index > 0 ? req.param('mainSearchCriteria.v.dn' + index) : req.param('mainSearchCriteria.v.dn'),
		originalText: index > 0 ? req.param('mainSearchCriteria.v.ot' + index) : req.param('mainSearchCriteria.v.ot')
	}
};

function MainSearchCriteriaPeek(req, index) {	
	var displayName = index > 0 ? req.param('mainSearchCriteria.v.dn' + index) : req.param('mainSearchCriteria.v.dn');	
	return displayName == undefined ? false : true;
};

function MainSearchCriteria(req) {
	//loop through MainSearchCriterias
	var mainSearchCriterias = [];
	var index = 0;

	while (MainSearchCriteriaPeek(req, index)) {
		
		mainSearchCriterias.push(_MainSearchCriteria(req, index));
		index++;
		
	}
	return mainSearchCriterias;
};

function LocationOfInterest(req) {
	return {
		address: {
			zip: req.param('locationOfInterest.addr.ZIP'),
			city: req.param('locationOfInterest.addr.CTY'),
			state: req.param('locationOfInterest.addr.STA'),
			country: req.param('locationOfInterest.addr.CNT')
		}
		
	}
};