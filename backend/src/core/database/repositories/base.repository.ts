import {
  DataSource,
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export abstract class BaseRepository<T extends ObjectLiteral> {
  protected repo: Repository<T>;

  constructor(
    protected readonly connection: DataSource | EntityManager,
    entity: EntityTarget<T>,
  ) {
    this.repo = connection.getRepository(entity);
  }

  setTransactionManager(manager: EntityManager): this {
    this.repo = manager.getRepository(this.repo.target);
    return this;
  }
}
