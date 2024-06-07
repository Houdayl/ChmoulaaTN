import { Test, TestingModule } from '@nestjs/testing';
import { PostMeklaController } from './post-mekla.controller';

describe('PostMeklaController', () => {
  let controller: PostMeklaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostMeklaController],
    }).compile();

    controller = module.get<PostMeklaController>(PostMeklaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
