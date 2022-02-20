import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Acoes } from './modelo/acoes';
import { AcoesService } from './acoes.service';
import { Subscription, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

const ESPERA_DIGITACAO_MS = 2000;

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent {
  acoesInput = new FormControl();
  todasAsAcoes$ = this.acoesService.getAcoes()
                      .pipe(
                          tap(() => { console.log('Fluxo inicial') })
                      );

  filtroPeloInput$ = this.acoesInput
                        .valueChanges
                        .pipe(
                          debounceTime(ESPERA_DIGITACAO_MS),
                          tap(() => { console.log('Fluxo do filtro: ')}),
                          tap(console.log),
                          filter( //Quantidas mínimas de letras
                            (valorDigitado) => valorDigitado.length >= 3 || !valorDigitado.length
                          ),
                          distinctUntilChanged(),
                          switchMap((valorDigitado) => this.acoesService.getAcoes(valorDigitado)
                        )
                      );
  acoes$ =  merge(this.todasAsAcoes$, this.filtroPeloInput$);
  constructor(private acoesService: AcoesService) {}
}
