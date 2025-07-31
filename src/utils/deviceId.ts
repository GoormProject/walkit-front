/**
 * 디바이스 ID 관리 유틸리티
 * localStorage에서 deviceId를 관리하고, 없으면 UUID를 생성합니다.
 */

const DEVICE_ID_KEY = 'walkit_device_id';

/**
 * 디바이스 ID를 가져옵니다. 없으면 새로 생성합니다.
 */
export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
};

/**
 * 디바이스 ID를 설정합니다.
 */
export const setDeviceId = (deviceId: string): void => {
  localStorage.setItem(DEVICE_ID_KEY, deviceId);
};

/**
 * 디바이스 ID를 삭제합니다.
 */
export const removeDeviceId = (): void => {
  localStorage.removeItem(DEVICE_ID_KEY);
};

/**
 * 디바이스 ID가 존재하는지 확인합니다.
 */
export const hasDeviceId = (): boolean => {
  return localStorage.getItem(DEVICE_ID_KEY) !== null;
};
