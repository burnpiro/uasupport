import { faker } from '@faker-js/faker';
import { sample } from 'lodash';
// utils
import { mockImgAvatar } from '../utils/mockImages';

const fromAddresses = [
  faker.address.nearbyGPSCoordinate([49.783, 22.767]),
  faker.address.nearbyGPSCoordinate([51.143, 23.471]),
  faker.address.nearbyGPSCoordinate([50.723, 23.252]),
  faker.address.nearbyGPSCoordinate([49.839, 24.029], 100)
];

const ToAddresses = [
  faker.address.nearbyGPSCoordinate([49.783, 22.767]),
  faker.address.nearbyGPSCoordinate([51.143, 23.471]),
  faker.address.nearbyGPSCoordinate([50.723, 23.252]),
  faker.address.nearbyGPSCoordinate([49.839, 24.029], 100)
];

// ----------------------------------------------------------------------

const transport = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: mockImgAvatar(index + 1),
  name: faker.name.findName(),
  addressFrom: faker.address.cityName() + ', ' + faker.address.streetAddress(true),
  addressTo: faker.address.cityName() + ', ' + faker.address.streetAddress(true),
  from: sample(fromAddresses),
  to: faker.address.nearbyGPSCoordinate([50.866, 20.628], 200),
  isVerified: faker.datatype.boolean(),
  status: sample(['szukam', 'dam']),
  car: faker.vehicle.vehicle(),
  date: faker.date.soon(2),
  people: faker.random.number(5),
  description: faker.lorem.paragraph(2),
  phone: '321381283',
  fb: 'https://www.facebook.com/pirokemal'
}));

export default transport;
