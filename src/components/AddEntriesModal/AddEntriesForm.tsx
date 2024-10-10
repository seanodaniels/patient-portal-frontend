import { useState, SyntheticEvent, useEffect } from "react";
import { 
  Input,
  TextField, 
  InputLabel, 
  MenuItem, 
  Select, 
  Grid, 
  Button, 
  SelectChangeEvent, 
  Alert, 
  Box } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox'; 
import { 
  EntriesFormValues, 
  EntriesType,
  HealthCheckRating 
} from "../../types";
import diagnosisCodesList from '../../codes.ts';

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntriesFormValues) => void;
}

interface EntriesTypeOptions {
  value: EntriesType;
  label: string;
}

const entriesTypeOptions: EntriesTypeOptions[] = Object.values(EntriesType).map(v => ({
  value: v, label: v.toString()
}));

interface HealthCheckRatingOptions {
  value: HealthCheckRating;
  label: string;
}

const StringIsNumber = (value:string) => isNaN(Number(value)) === false;

const healthCheckRatingOptions: HealthCheckRatingOptions[] = 
  Object.keys(HealthCheckRating)
  .filter(StringIsNumber)
  .map(v => {
    return ({
      value: Number(v), label: v.toString()
    });
  }
);

const AddEntriesForm = ({ onCancel, onSubmit }: Props) => {
  const [ error, setError ] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [entriesType, setEntriesType] = useState<EntriesType>(EntriesType.Hospital);
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState('');
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(0);

  const [showHospital, setShowHospital] = useState(false);
  const [showOccupationalHealthcare, setShowOccupationalHealthcare] = useState(false);
  const [showHealthCheck, setShowHealthCheck] = useState(false);

  useEffect(() => {
    switch (entriesType) {
      case EntriesType.Hospital:
          setShowHospital(true);
          setShowOccupationalHealthcare(false);
          setShowHealthCheck(false);        
        break;
      case EntriesType.OccupationalHealthcare:
        setShowHospital(false);
        setShowOccupationalHealthcare(true);
        setShowHealthCheck(false);        
      break;
      case EntriesType.HealthCheck:
        setShowHospital(false);
        setShowOccupationalHealthcare(false);
        setShowHealthCheck(true);        
      break;
      default:
        setError('ERROR: entries type not selected.');       
      break;
    }
              
  }, [entriesType]);

  /*
     Event Handlers
     ==========================================================================
  */
  const onEntriesTypeChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if ( typeof event.target.value === "string") {
      const value = event.target.value;
      const entriesType = Object.values(EntriesType).find(g => g.toString() === value);
      if (entriesType) {
        setEntriesType(entriesType);
      }
      switch (entriesType) {
        case "Hospital":
          setEntriesType(EntriesType.Hospital);
          break;
        case "OccupationalHealthcare":
          setEntriesType(EntriesType.OccupationalHealthcare);
          break;
        case "HealthCheck":
          setEntriesType(EntriesType.HealthCheck);
          break;
        default:
          setEntriesType(EntriesType.Hospital);
          break;
      }
    }
  };

  const onHealthCheckRatingChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if ( typeof event.target.value === "string") {
      const value = event.target.value;
      const healthCheckType = Object.values(HealthCheckRating).find(g => g.toString() === value);
      switch (healthCheckType) {
        case 0:
          setHealthCheckRating(0);
          break;
        case 1:
          setHealthCheckRating(1);
          break;
        case 2:
          setHealthCheckRating(2);
          break;
        case 3:
          setHealthCheckRating(3);
          break;
        default:
          setHealthCheckRating(0);
          break;
      }
    }
  };

  const diagnosisCodesChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    const {
      target: { value },
    } = event;
    console.log('value: ', value);
    const sdcArray = typeof value === 'string' ? value.split(',') : value;
    setDiagnosisCodes(sdcArray);
  };

  const addEntriesHospital = (event: SyntheticEvent) => {
    event.preventDefault();
      onSubmit({
        type: EntriesType.Hospital,
        description,
        date,
        specialist,
        diagnosisCodes,
        discharge: {
          date: dischargeDate,
          criteria: dischargeCriteria
        }
      });
  };

  const addEntriesOccupationalHealthcare = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      type: EntriesType.OccupationalHealthcare,
      employerName,
      description,
      date,
      specialist,
      sickLeave: {
        startDate: sickLeaveStartDate,
        endDate: sickLeaveEndDate
      },
      diagnosisCodes
    });
  };

  const addEntriesHealthCheck = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      type: EntriesType.HealthCheck,
      description,
      date,
      specialist,
      diagnosisCodes,
      healthCheckRating
    });
  };

  /*
    Component Main
    ==========================================================================
  */
  return (
    <div id="entries-form">
      <p>codes: { diagnosisCodes[0] } || typeof: { typeof diagnosisCodes }</p>
      {error && <Alert severity="error">{error}</Alert>}
      <InputLabel>Type</InputLabel>
        <Select
          label="Type"
          fullWidth 
          value={entriesType} 
          onChange={onEntriesTypeChange}
          className="entries-input" 
        >
          {entriesTypeOptions.map(option => 
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          )}
        </Select>

      <Box component="form" onSubmit={addEntriesHospital} className={showHospital ? 'showForm' : 'hideForm'}>
        <TextField
          label="Description"
          fullWidth 
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          className="entries-input" 
          required
        />
        <div className="form-box-outline entries-input">
          <InputLabel>Date</InputLabel>
          <Input 
            type="date"
            name="Date" 
            value={date}
            onChange={({ target }) => setDate(target.value)}
            className="entries-input" 
            required 
          />        
        </div>
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
          className="entries-input" 
          required
        />
        <InputLabel>Diagnosis Codes</InputLabel>
        <Select       
          label="DiagnosisCodes"
          multiple 
          onChange={diagnosisCodesChange}
          value={diagnosisCodes}
          className="entries-input" 
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')} 
        >
          {diagnosisCodesList.map(c => (
            <MenuItem key={c} value={c}>
              <Checkbox checked={diagnosisCodes.includes(c)} />
              <ListItemText primary={c} />
            </MenuItem>
          ))}
        </Select>
        <div className="form-box-outline entries-input">
          <InputLabel>Discharge Date</InputLabel>
          <Input 
            type="date" 
            name="Discharge Date" 
            value={dischargeDate}
            onChange={({ target }) => setDischargeDate(target.value)}
            className="entries-input" 
            required 
          />        
        </div>
        <TextField
          label="Discharge Criteria"
          fullWidth
          value={dischargeCriteria}
          onChange={({ target }) => setDischargeCriteria(target.value)}
          className="entries-input" 
          required
        />
        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box component="form" onSubmit={addEntriesOccupationalHealthcare} className={showOccupationalHealthcare ? 'showForm' : 'hideForm'}>
        <TextField
          required 
          label="Description"
          fullWidth 
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          className="entries-input"
        />
        <div className="form-box-outline entries-input">
          <InputLabel>Date</InputLabel>
          <Input 
            type="date" 
            name="Date" 
            value={date}
            onChange={({ target }) => setDate(target.value)}
            className="entries-input" 
            required 
          />        
        </div>
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
          className="entries-input" 
          required
        />
        <TextField
          label="Employer Name"
          fullWidth
          value={employerName}
          onChange={({ target }) => setEmployerName(target.value)}
          className="entries-input" 
          required
        />
        <div className="form-box-outline entries-input">
          <InputLabel>Sickleave Start</InputLabel>
          <Input 
            type="date" 
            name="Sickleave Start" 
            value={sickLeaveStartDate}
            onChange={({ target }) => setSickLeaveStartDate(target.value)}
            className="entries-input" 
            required 
          />        
        </div>
        <div className="form-box-outline entries-input">
          <InputLabel>Sickleave End</InputLabel>
          <Input 
            type="date" 
            name="Sickleave End" 
            value={sickLeaveEndDate}
            onChange={({ target }) => setSickLeaveEndDate(target.value)}
            className="entries-input" 
            required 
          />        
        </div>
        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box component="form" onSubmit={addEntriesHealthCheck} className={showHealthCheck ? 'showForm' : 'hideForm'}>
        <TextField
          label="Description"
          fullWidth 
          value={description}
          onChange={({ target }) => setDescription(target.value)}
          className="entries-input" 
          required
        />
        <div className="form-box-outline entries-input">
          <InputLabel>Date</InputLabel>
          <Input 
            type="date" 
            name="Date" 
            value={date}
            onChange={({ target }) => setDate(target.value)}
            className="entries-input" 
            required 
          />        
        </div>
        <TextField
          label="Specialist"
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
          className="entries-input" 
          required
        />
        <InputLabel>Health Check Rating</InputLabel>
        <Select
          label="HealthCheckRating"
          value={healthCheckRating.toString()}
          onChange={onHealthCheckRatingChange}
          className="entries-input"
        >
          {healthCheckRatingOptions.map(option => 
            <MenuItem key={option.label} value={option.value}>
              {option.value}
            </MenuItem>
            )}
        </Select>
        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default AddEntriesForm;