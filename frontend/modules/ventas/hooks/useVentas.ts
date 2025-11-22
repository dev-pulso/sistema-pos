

import { useMutation } from '@tanstack/react-query';
import React from 'react'
import { VentasDto, VentasResponse } from '../type/ventas';
import { crearVentas } from '../services/ventas.service';
import { useAuthStore } from '@/store/auth.store';

export default function useVentas() {
    const { token } = useAuthStore()
    const mutationVentas = useMutation<VentasResponse, Error, VentasDto>({
        mutationFn: crearVentas,
    });
    return {
        mutationVentas
    }
}
