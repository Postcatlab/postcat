import { ByteToStringPipe } from './get-size.pipe';

describe('ByteToStringPipe', () => {
  const pipe = new ByteToStringPipe();
  it('transform different size', () => {
    expect(pipe.transform(100)).toBe('100.00B');
    expect(pipe.transform(1024)).toBe('1.00KB');
    expect(pipe.transform(1024 * 1024)).toBe('1.00MB');
  });
});
