import Groq from 'groq-sdk';
import Config from './env';

const groq = new Groq({ apiKey: Config.GROQ_API_KEY });

export default groq;
