// utils/passwordValidator.ts

export interface PasswordValidation {
  isValid: boolean;
  hasMinLength: boolean;
  hasNumber: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasSpecialChar: boolean;
}

// /**
//  * Valide un mot de passe selon les critères de sécurité
//  * @param password - Le mot de passe à valider
//  * @returns Un objet contenant le statut de chaque critère de validation
//  */
export const validatePassword = (password: string): PasswordValidation => {
  // Si le mot de passe est vide ou trop court, retourner une validation échouée
  if (password.length < 8) {
    return {
      isValid: false,
      hasMinLength: false,
      hasNumber: false,
      hasUppercase: false,
      hasLowercase: false,
      hasSpecialChar: false
    };
  }

  // Convertit la chaîne de caractères en tableau de codes ASCII
  const charCodes = password.split("").map(char => char.charCodeAt(0));
  
  // Fonctions de vérification pour chaque critère
  const isNumber = (code: number) => code >= 48 && code <= 57; // 0-9
  const isUppercase = (code: number) => code >= 65 && code <= 90; // A-Z
  const isLowercase = (code: number) => code >= 97 && code <= 122; // a-z
  const isSpecialChar = (code: number) => 
    (code >= 33 && code <= 47) || // !"#$%&'()*+,-./
    (code >= 58 && code <= 64) || // :;<=>?@
    (code >= 91 && code <= 96) || // [\]^_`
    (code >= 123 && code <= 126); // {|}~
  
  // Vérifie si chaque critère est respecté
  const hasNumber = charCodes.some(isNumber);
  const hasUppercase = charCodes.some(isUppercase);
  const hasLowercase = charCodes.some(isLowercase);
  const hasSpecialChar = charCodes.some(isSpecialChar);
  const hasMinLength = password.length >= 8;
  
  // Détermine la validité globale du mot de passe
  const isValid = hasNumber && hasUppercase && hasLowercase && hasSpecialChar && hasMinLength;
  
  return {
    isValid,
    hasMinLength,
    hasNumber,
    hasUppercase,
    hasLowercase,
    hasSpecialChar
  };
};

// /**
//  * Génère les classes CSS pour le style du champ mot de passe
//  * @param password - Le mot de passe actuel
//  * @param validation - L'objet de validation du mot de passe
//  * @returns Les classes CSS à appliquer au champ
//  */
export const getPasswordFieldClasses = (password: string, validation: PasswordValidation): string => {
  const baseClasses = "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 placeholder:text-gray-400";
  
  if (!password) {
    return `${baseClasses} focus:ring-[#00B4D8]`;
  }
  
  if (validation.isValid) {
    return `${baseClasses} border-green-500 text-green-600 focus:ring-green-200`;
  } else {
    return `${baseClasses} border-red-500 focus:ring-red-200`;
  }
};

/**
 * Retourne les critères de validation avec leurs messages
 * @returns Un tableau d'objets contenant les critères et leurs messages
 */
export const getPasswordCriteria = () => [
  { key: 'hasMinLength' as keyof PasswordValidation, message: 'Au moins 8 caractères' },
  { key: 'hasUppercase' as keyof PasswordValidation, message: 'Une majuscule' },
  { key: 'hasLowercase' as keyof PasswordValidation, message: 'Une minuscule' },
  { key: 'hasNumber' as keyof PasswordValidation, message: 'Un chiffre' },
  { key: 'hasSpecialChar' as keyof PasswordValidation, message: 'Un caractère spécial' }
];