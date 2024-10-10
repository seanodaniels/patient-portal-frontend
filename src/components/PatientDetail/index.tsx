import { useState, useEffect } from 'react'
import axios from 'axios';
import { useMatch } from 'react-router-dom';
import patientService from "../../services/patients";
import { Patient, Entry, EntriesType, EntriesFormValues } from "../../types";
import AddEntriesModal from "../../components/AddEntriesModal";
import { Favorite } from '@mui/icons-material';
import { Button } from '@mui/material';

const PatientDetail = () => {
  const match = useMatch('/patient/:key');

  const [ patientInfo, setPatientInfo ] = useState<Patient>();
  const [ errorMessage, setErrorMessage ] = useState<string>('');

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntries = async (values: EntriesFormValues) => {
    event?.preventDefault();
    if (patientInfo && patientInfo.id) {    
      try {
        const newPatient = await patientService.updatePatientEntries(patientInfo.id, values);
        setPatientInfo(newPatient);
        setModalOpen(false);
      } catch(e: unknown) {
        if (axios.isAxiosError(e)) {
          if (e?.response?.data && typeof e?.response?.data === "string") {
            const message = e.response.data.replace('Something went wrong. Error: ', '');
            console.error(message);
            setError(message);
          } else {
            setError("Unrecognized axios error");
          }
        } else {
          console.error("Unknown error", e);
          setError("Unknown error");
        }
       }
    }
  };

  useEffect(() => {
    const patientId = match?.params.key;

    if (patientId) {
      const fetchPatient = async (patientId: string | undefined) => {
        try {
          const patient = await patientService.getPatient(patientId!);
          setPatientInfo(patient);
        } catch (error) {
          setErrorMessage(`Error: ${error}`);
        }
      };
      void fetchPatient(patientId);  
    }

  }, [match?.params.key]);

  const DisplayHeart = ({ heartType }: DisplayHeartProps) => {
    switch(heartType) {
      case 0:
        return <Favorite style={{ color: 'green' }}  />
        break;
      case 1:
        return <Favorite style={{ color: 'yellow' }}  />
        break;
      case 2: 
        return <Favorite style={{ color: 'red' }}  />
        break;
      default:
        break;
    }
  };

  interface DisplayHeartProps {
    heartType: number;
  }

  interface EntriesProps {
    theEntries: Entry[];
  }

  interface EntryProps {
    entry: Entry;
  }

  const theEntries = patientInfo?.entries;

  const DisplayEntryBasics = ({ entry }: EntryProps) => {
    return (
      <div>        
        <p><strong>{entry.date}</strong> (Diagnosed by {entry.specialist})<br />
        <em>{entry.description}</em></p>
          {entry.diagnosisCodes && entry.diagnosisCodes.length > 0
            ? <div>
                 Diagnosis Codes:<br />
                { entry.diagnosisCodes.map(c => <div key={c}>- {c}<br /></div>) }
              </div>
            : null
          }
      </div>
    );
  };

  const DisplayEntries = ({ theEntries }: EntriesProps) => {
    return (
      <div>
        <h3>Entries</h3>
        { 
          theEntries.map(p => {
            switch (p.type) {
              case EntriesType.HealthCheck:
                return (
                  <div key={p.id} className="entryContainer">
                    <DisplayEntryBasics entry={p} />
                    <p><DisplayHeart heartType={p.healthCheckRating} /></p>
                  </div>
                );
                break;
              case EntriesType.OccupationalHealthcare:
                return  (
                  <div key={p.id} className="entryContainer">
                    <DisplayEntryBasics entry={p} />
                    <p>Employer Name: {p.employerName}<br />
                    { p.sickLeave 
                      ? <span>Sick Leave: {p.sickLeave.startDate} to {p.sickLeave.endDate}</span>
                      : null
                    }
                    </p>
                  </div>
                );
                break;
              case EntriesType.Hospital: 
                return (
                  <div key={p.id} className="entryContainer">
                    <DisplayEntryBasics entry={p} />
                    <p>Discharge date: {p.discharge.date}<br />
                    { p.discharge.criteria
                      ? p.discharge.criteria
                      : null
                    }
                    </p>
                  </div>
                );
                break;
              default: 
                break;
            }
          }
        )}
        <AddEntriesModal
          modalOpen={modalOpen}
          onSubmit={submitNewEntries}
          error={error}
          onClose={closeModal}
        />
        <Button variant="contained" onClick={() => openModal()}>
          Add New Entry
        </Button>
      </div>
    );
  };

  if (!patientInfo && !errorMessage) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {errorMessage ? <div className="error-message"><h2>Error: ${errorMessage}</h2></div> : null }
      {patientInfo ? 
        <div>
          <h2>{patientInfo.name}</h2>
          <p>
            ssn: {patientInfo.ssn}<br />
            gender identity: {patientInfo.gender}<br />
            occupation: {patientInfo.occupation}<br />
          </p>          
          { 
            theEntries && theEntries.length > 0 
            ? <DisplayEntries theEntries={theEntries} /> 
            : null 
          }
        </div>
       : null}
    </div>
  );
};

export default PatientDetail;