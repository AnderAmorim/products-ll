import { Global, Module } from '@nestjs/common';
import { IUserRepositoryToken } from './interfaces/relational/user.repository';
import { UserRepositoryPostgres } from './pg/user.repository.pg';
import { PgModule } from './pg/pg.module';
import { ISystemUserRepositoryToken } from './interfaces/relational/system-user.repository';
import { SystemUserRepositoryPostgres } from './pg/system-user.repository.pg';
import { IFavoritesRepositoryToken } from './interfaces/relational/favorites.repository';
import { FavoritesRepository } from './pg/favorites.repository.pg';

@Global()
@Module({
  imports: [
    PgModule,
  ],
  providers: [
    {
      provide: IUserRepositoryToken,
      useClass: UserRepositoryPostgres, 
    },
    
    {
      provide: ISystemUserRepositoryToken,
      useClass: SystemUserRepositoryPostgres,
    },
    {
      provide: IFavoritesRepositoryToken,
      useClass: FavoritesRepository,
    }
  ],
  exports: [IUserRepositoryToken, ISystemUserRepositoryToken, IFavoritesRepositoryToken],
})
export class RepositoriesModule {}