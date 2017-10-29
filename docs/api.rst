.. _API:

====
API
====

.. index:: GraphQLFactory

``GraphQLFactory`` Instance
+++++++++++++++++++++++++++

GraphQLFactory requires graphql to be passed as its only parameter to create a factory instance::

    const factory = GraphQLFactory(graphql)

.. hint::

    When using ``import`` to load ``graphql`` all exports should be imported with ``import * as graphql from 'graphql'``

``factory`` prototype
+++++++++++++++++++++

The factory prototype is used to create a library

.. _factory_make:

.. index:: Make

``make()``
-------------------------------------------------------------------------------

**Signature:** ``make(Object definition [, Object options])``

Creates a new library

``options``

- ``compile`` When **false** skips the compile process
- ``plugin`` Array of plugins
- ``beforeMiddleware``
- ``afterMiddleWare``
- ``beforeTimeout``
- ``afterTimeout``
