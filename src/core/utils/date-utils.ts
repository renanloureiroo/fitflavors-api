/**
 * Utilitários para manipulação de datas em UTC
 */

/**
 * Converte uma data para UTC, garantindo que seja salva no formato correto
 * @param date - Data a ser convertida
 * @returns Data em UTC
 */
export function toUTC(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Retorna a data como UTC (sem conversão de timezone)
  return new Date(dateObj.getTime());
}

/**
 * Cria uma nova data em UTC para o momento atual
 * @returns Data atual em UTC
 */
export function nowUTC(): Date {
  return new Date();
}

/**
 * Converte uma data para o início do dia em UTC
 * @param date - Data base
 * @returns Data do início do dia em UTC
 */
export function startOfDayUTC(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const utcDate = new Date(dateObj);
  utcDate.setUTCHours(0, 0, 0, 0);
  return utcDate;
}

/**
 * Converte uma data para o final do dia em UTC
 * @param date - Data base
 * @returns Data do final do dia em UTC
 */
export function endOfDayUTC(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const utcDate = new Date(dateObj);
  utcDate.setUTCHours(23, 59, 59, 999);
  return utcDate;
}
