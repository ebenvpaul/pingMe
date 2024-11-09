import { AccountService } from './../services/accountService.service';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';


export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);

  if (accountService.currentUser()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accountService.currentUser()?.token}`
      }
    })
  }

  return next(req);
};