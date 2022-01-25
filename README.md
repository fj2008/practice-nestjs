## nestjs api practice

- nestjs로 기본적인 백엔드 api를 직접 만들어보는 연습을하는 레파지토리 입니다.
- mysql

```
mysql.server start
```

- redis 접속후 사용해야함

```
docker exec -it redis_service bash
redis-cli
auth [qw]
```

## Nestjs에서는 라이브러리에서 들고오는 방법은 별로 좋지않다. di를 활용!!

### 로그아웃api가 없는 이유

토큰기반 인증은 기본적으로 상태비저장을 추구하기 때문에. 세션기반 인증처럼
서버에서 어떤 사용자가 인증됐는지 추적하지 않습니다.(그렇게하면 토큰기반 인증에 메리트가 사라집니다.)
그렇기때문에 사용자가 로그아웃을 하기위해서는 서버측에선 아무런 작업을 수행할 필요가 없습니다.
클라이언트측에서 jwt토큰을 삭제하기만 하면되고
서버는 인증을위해서 사용자의 토큰을 계속해서 체크해주기만 하면 됩니다.

## TypeOrm 트렌잭션 처리

** TypeOrm에서 제공해주는 트랜잭션 처리는 크게 4가지 정도의 방법을 사용한다. **

### queryRunner

- queryRunner의 장점은 수동으로 트렌젝션 제어를 하기때문에 좀 더 유연하게 트랜젝션 처리를 할 수 있다는 장점이있습니다.
  하지만 문서에서처럼 new해서 들고오는 방법은 nest에서 권장하는 방식이 아니기때문에 di해서 커넥션 을 들고옵니다.
- 그리고 공식 문서에서는 queryRunner를 사용하라고 하는 이유는 데코레이터를 사용하면 서비스에 di하기도 힘들고 트랜젝션 처리가 제대로 이루어지지않습니다.

#### queryRunner 사용시 유의할점

- try할때 db로직이 이루어진후 마지막에 꼭 await queryRunner.commitTransaction(); 를 해줘서 커밋처리를 해줘야합니다.
- finally를 사용해서 try/catch가 끝나면 꼭 await queryRunner.release();를 사용해 줘서 db커넥션을 끊어줘야합니다
  - 왜냐하면 db에 커넥션이 계속늘어나면 좋지않을 뿐더러 일정 이상 넘어가면 커넥션이 안되기 때문입니다.
- Repository를 사용할때는 queryRunner.manager를 통해서 사용해야 트렌젝션이 걸립니다.
