import {Observable} from "rxjs";
import {retryWhen,delay} from "rxjs/operators";

/**
 * 小程序mounted  dom被创建后，低端机型，偶尔需要延迟才能获得rect.
 * @param queryFn
 * @param judgePassFn
 * @param delayTime
 * @param retryCount
 */
export const querySelector = (
  queryFn,
  judgePassFn,
  delayTime = 50,
  retryCount = 4,
) => {
  let retryCurrentCount = 0;
  return new Promise((resolve, reject) => {
    new Observable((ob) => {
      queryFn().exec((result:any) => {
        retryCurrentCount++ < retryCount && !judgePassFn(result)
          ? ob.error("Judgement Failure")
          : ob.next(result);
      });
    })
      .pipe(retryWhen((s) => s.pipe(delay(delayTime))))
      .subscribe(
        (result) => resolve(result),
        (err) => reject(err),
      );
  });
};